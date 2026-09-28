import logging
from datetime import datetime, timedelta
from app.models.incident import (
    IncidentCreate, Severity, IncidentStatus, ResolutionRequest
)
from app.repositories.incident_repo import incident_repo
from app.services.incident_service import incident_service

logger = logging.getLogger(__name__)

async def seed_realistic_incidents():
    """
    Seeds production-grade realistic synthetic incidents to demonstrate
    Hindsight memory retention and subsequent recall during investigations.
    """
    existing = await incident_repo.list_all()
    if existing:
        return

    logger.info("Seeding realistic demo incidents...")

    # 1. Historical Incident 1: Payment API Connection Pool Exhaustion (RESOLVED & RETAINED IN HINDSIGHT)
    inc1_in = IncidentCreate(
        title="PostgreSQL connection pool saturation under checkout load",
        description="Payment API latency spiked to 4.8s. Client checkouts timed out with 504 Gateway Timeout.",
        service="payment-api",
        severity=Severity.CRITICAL,
        environment="production",
        symptoms=[
            "HTTP 504 Gateway Timeout on /v1/checkout",
            "p99 latency surged from 140ms to 4800ms",
            "Active DB connections reached maximum limit 100/100"
        ],
        error_messages=[
            "org.postgresql.util.PSQLException: FATAL: remaining connection slots are reserved for non-replication superuser connections",
            "HikariPool-1 - Connection is not available, request timed out after 30000ms."
        ],
        affected_components=["payment-api", "postgres-primary", "checkout-flow"],
        logs_excerpt="""[ERROR] 14:22:01.104 [http-nio-8080-exec-42] o.h.e.j.s.SqlExceptionHelper - HikariPool-1 - Connection is not available, request timed out after 30000ms.
[WARN] 14:22:01.109 [http-nio-8080-exec-42] c.c.p.PaymentService - Transaction failed for checkoutId=ck_98241
[FATAL] 14:22:02.001 [postgres-pool-monitor] Pool exhausted: 100 active, 0 idle, 142 waiting threads."""
    )
    inc1 = await incident_repo.create(inc1_in)
    
    # Resolve and retain in Hindsight
    await incident_service.resolve_and_retain(
        inc1.id,
        ResolutionRequest(
            verified_root_cause="HikariCP connection leak in webhook retry executor combined with max_connections ceiling of 100 in RDS parameter group.",
            verification_method="Inspected pg_stat_activity queries in state 'idle in transaction' originating from webhook-worker thread pool.",
            impact_summary="Payment processing degraded for 18 minutes; 142 transactions dropped.",
            mitigation_applied="Restarted webhook worker pods to flush orphaned pool connections; scaled max_connections to 250.",
            permanent_fix="Patched PaymentWebhookClient with try-with-resources to properly close JDBC connection handles in failure paths, and bumped RDS max_connections to 300 with pgbouncer pooling layer.",
            is_verified_by_human=True,
            lessons_learned=[
                "Always wrap external webhook invocations with try-with-resources or explicit close blocks.",
                "Deploy pgbouncer sidecar to buffer transient checkout spikes.",
                "Alert when HikariCP active connections exceed 80% capacity."
            ],
            follow_up_tickets=["INFRA-4421", "PAY-904"]
        )
    )

    # 2. Historical Incident 2: Auth Service Redis Token Spike (RESOLVED & RETAINED)
    inc2_in = IncidentCreate(
        title="Auth service authentication token cache stampede",
        description="Sudden spike in auth failures following token cache cluster restart.",
        service="auth-service",
        severity=Severity.HIGH,
        environment="production",
        symptoms=[
            "User session validation latency escalated to 2.1s",
            "Redis cache hit ratio dropped from 99.4% to 22%",
            "Authentication database CPU surged to 96%"
        ],
        error_messages=[
            "RedisCommandTimeoutException: Command timed out after 2000ms",
            "AuthTokenVerifyError: unable to verify session token in store"
        ],
        affected_components=["auth-service", "redis-session-cluster", "user-db"],
        logs_excerpt="""[ERROR] 09:12:44 RedisCommandTimeoutException: Command timed out after 2000ms [key=sess_token_auth_91823]
[WARN] 09:12:45 Fallback to Postgres user_sessions DB table under high concurrency."""
    )
    inc2 = await incident_repo.create(inc2_in)
    await incident_service.resolve_and_retain(
        inc2.id,
        ResolutionRequest(
            verified_root_cause="Cache stampede / Thundering herd on session key eviction with no jittered TTL or mutex locks.",
            verification_method="Redis SLOWLOG analysis showed 40,000 simultaneous GET calls for expired keys.",
            impact_summary="15 minutes of slow user logins.",
            mitigation_applied="Pre-warmed active session cache with script and applied probabilistic early expiration.",
            permanent_fix="Integrated distributed lock (redlock) around DB fallback query and added +/- 15% random TTL jitter.",
            is_verified_by_human=True,
            lessons_learned=[
                "Never set static TTL on cache keys during massive batch user migrations.",
                "Always apply early refresh with jitter."
            ],
            follow_up_tickets=["SEC-1102"]
        )
    )

    # 3. Active Incident: Recurring Payment API connection exhaustion (DEMONSTRATES MEMORY RECALL)
    inc3_in = IncidentCreate(
        title="High payment failure rate with connection timeout errors",
        description="Spike in 504 gateway timeouts on payment service during flash sale. Multiple threads blocked awaiting database connection.",
        service="payment-api",
        severity=Severity.CRITICAL,
        environment="production",
        symptoms=[
            "504 Gateway Timeout during checkout",
            "Elevated API latency on /v1/checkout",
            "DB connection pool saturation reported"
        ],
        error_messages=[
            "HikariPool-1 - Connection is not available, request timed out after 30000ms.",
            "PSQLException: FATAL: remaining connection slots are reserved"
        ],
        affected_components=["payment-api", "postgres-primary"],
        logs_excerpt="""[ERROR] 18:40:12 [http-nio-8080-exec-19] HikariPool-1 - Connection is not available, request timed out after 30000ms.
[ERROR] 18:40:13 [http-nio-8080-exec-22] PSQLException: FATAL: remaining connection slots are reserved for non-replication superuser connections."""
    )
    inc3 = await incident_repo.create(inc3_in)

    # 4. Active Incident: Background worker memory pressure
    inc4_in = IncidentCreate(
        title="Checkout worker container terminated by OOMKilled",
        description="Kafka consumer pods restarting continuously under heavy message backlog.",
        service="checkout-worker",
        severity=Severity.MEDIUM,
        environment="production",
        symptoms=[
            "Kafka lag accumulating rapidly (>50,000 unread messages)",
            "Container exit code 137 (OOMKilled)",
            "Pod restarts count reached 14"
        ],
        error_messages=[
            "Killed (signal 9 / OOMKilled)",
            "Container checkout-worker exceeded memory limit 1024Mi"
        ],
        affected_components=["checkout-worker", "kafka-cluster"],
        logs_excerpt="""[INFO] 17:01:00 Consuming batch of 5000 events
[WARN] 17:01:05 Heap utilization 98% (998MB / 1024MB)
[FATAL] 17:01:08 container terminated with exit code 137 (OOMKilled)"""
    )
    await incident_repo.create(inc4_in)
    
    logger.info("Successfully seeded demo incidents with Hindsight memory records.")
