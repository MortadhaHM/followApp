from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.bash import BashOperator

default_args = {
    'owner': 'mortadha',
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

with DAG(
    dag_id='dbt_nightly_run',
    description='Runs dbt models every night to refresh the finance data warehouse',
    default_args=default_args,
    start_date=datetime(2026, 7, 31),
    schedule_interval='0 0 * * *',  # every day at midnight
    catchup=False,
    tags=['dbt', 'finance', 'warehouse'],
) as dag:

    dbt_run = BashOperator(
        task_id='dbt_run',
        bash_command='cd /opt/airflow/finance_dbt && dbt run --profiles-dir /opt/airflow/.dbt',
    )

    dbt_test = BashOperator(
        task_id='dbt_test',
        bash_command='cd /opt/airflow/finance_dbt && dbt test --profiles-dir /opt/airflow/.dbt',
    )

    dbt_run >> dbt_test