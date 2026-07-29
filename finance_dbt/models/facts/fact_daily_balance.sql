with transactions as (

    select * from {{ ref('fact_transactions') }}

),

dim_date as (

    select * from {{ ref('dim_date') }}

),

daily_aggregates as (

    select
        user_id,
        id_date,

        sum(case when tx_type = 'income'  then amount else 0 end) as total_income,
        sum(case when tx_type = 'expense' then amount else 0 end) as total_expenses,
        sum(case when tx_type = 'income'  then amount else 0 end) -
        sum(case when tx_type = 'expense' then amount else 0 end) as net_savings,
        count(case when tx_type = 'expense' then 1 end) > 0        as had_any_spending

    from transactions
    group by user_id, id_date

),

final as (

    select
        row_number() over (
            order by a.user_id, d.full_date
        )                           as id_balance,

        d.date_key                  as id_date,
        a.user_id,

        a.total_income,
        a.total_expenses,
        a.net_savings,

        sum(a.net_savings) over (
            partition by a.user_id
            order by d.full_date
            rows between unbounded preceding and current row
        )                           as running_balance,

        a.had_any_spending

    from daily_aggregates a
    join dim_date d on a.id_date = d.date_key

)

select * from final