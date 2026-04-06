"""add assignments ratings and worker reliability metrics

Revision ID: 20260406_0001
Revises:
Create Date: 2026-04-06 00:00:01
"""

from alembic import op
import sqlalchemy as sa


revision = "20260406_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "worker_profiles",
        sa.Column("total_jobs", sa.Integer(), nullable=False, server_default="0"),
    )
    op.add_column(
        "worker_profiles",
        sa.Column("completed_jobs", sa.Integer(), nullable=False, server_default="0"),
    )
    op.add_column(
        "worker_profiles",
        sa.Column("no_show_count", sa.Integer(), nullable=False, server_default="0"),
    )
    op.add_column(
        "worker_profiles",
        sa.Column("avg_rating", sa.Float(), nullable=False, server_default="0"),
    )
    op.add_column(
        "worker_profiles",
        sa.Column("reliability_score", sa.Float(), nullable=False, server_default="0"),
    )

    op.create_table(
        "assignments",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("job_id", sa.Integer(), nullable=False),
        sa.Column("worker_id", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(), nullable=False, server_default="pending"),
        sa.Column("created_at", sa.TIMESTAMP(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", sa.TIMESTAMP(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.ForeignKeyConstraint(["job_id"], ["jobs.id"]),
        sa.ForeignKeyConstraint(["worker_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_assignments_id"), "assignments", ["id"], unique=False)
    op.create_index(op.f("ix_assignments_job_id"), "assignments", ["job_id"], unique=False)
    op.create_index(op.f("ix_assignments_worker_id"), "assignments", ["worker_id"], unique=False)

    op.create_table(
        "ratings",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("job_id", sa.Integer(), nullable=False),
        sa.Column("worker_id", sa.Integer(), nullable=False),
        sa.Column("client_id", sa.Integer(), nullable=False),
        sa.Column("rating", sa.Integer(), nullable=False),
        sa.Column("feedback", sa.TEXT(), nullable=True),
        sa.Column("created_at", sa.TIMESTAMP(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.CheckConstraint("rating >= 1 AND rating <= 5", name="ck_ratings_range"),
        sa.ForeignKeyConstraint(["client_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["job_id"], ["jobs.id"]),
        sa.ForeignKeyConstraint(["worker_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_ratings_id"), "ratings", ["id"], unique=False)
    op.create_index(op.f("ix_ratings_job_id"), "ratings", ["job_id"], unique=False)
    op.create_index(op.f("ix_ratings_worker_id"), "ratings", ["worker_id"], unique=False)
    op.create_index(op.f("ix_ratings_client_id"), "ratings", ["client_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_ratings_client_id"), table_name="ratings")
    op.drop_index(op.f("ix_ratings_worker_id"), table_name="ratings")
    op.drop_index(op.f("ix_ratings_job_id"), table_name="ratings")
    op.drop_index(op.f("ix_ratings_id"), table_name="ratings")
    op.drop_table("ratings")

    op.drop_index(op.f("ix_assignments_worker_id"), table_name="assignments")
    op.drop_index(op.f("ix_assignments_job_id"), table_name="assignments")
    op.drop_index(op.f("ix_assignments_id"), table_name="assignments")
    op.drop_table("assignments")

    op.drop_column("worker_profiles", "reliability_score")
    op.drop_column("worker_profiles", "avg_rating")
    op.drop_column("worker_profiles", "no_show_count")
    op.drop_column("worker_profiles", "completed_jobs")
    op.drop_column("worker_profiles", "total_jobs")
