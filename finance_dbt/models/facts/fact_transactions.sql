with stg_transactions as (

    select * from {{ ref('stg_transactions') }}

),

dim_category as (

    select * from {{ ref('dim_category') }}

),

dim_date as (

    select * from {{ ref('dim_date') }}

),

final as (

    select
        -- surrogate key
        row_number() over (
            order by t.transaction_date, t.created_at
        )                           as id_transaction,

        -- foreign keys
        d.date_key                  as id_date,
        c.category_key              as id_cat,

        -- user filter column
        t.user_id,

        -- measures
        t.amount,
        t.tx_type,
        t.description

    from stg_transactions t

    left join dim_date d
        on t.transaction_date = d.full_date

    left join dim_category c
        on t.category_raw = c.category_name
        and t.tx_type = c.category_type

)

select * from final