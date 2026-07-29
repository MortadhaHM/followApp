with transactions as (

    select distinct
        category_raw,
        tx_type
    from {{ ref('stg_transactions') }}
    where category_raw is not null
        and category_raw != 'string'

),

final as (

    select
        row_number() over (
            order by tx_type, category_raw
        )                       as category_key,
        category_raw            as category_name,
        tx_type                 as category_type,
        lower(
            replace(category_raw, ' ', '_')
        )                       as normalized_name

    from transactions

)

select * from final