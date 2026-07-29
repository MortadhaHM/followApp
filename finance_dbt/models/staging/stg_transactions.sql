with source as (

    select * from {{ source('public', 'transactions') }}

),

renamed as (

    select
        -- surrogate key: clean integer instead of UUID
        row_number() over (order by date, created_at) as id_transaction,

        -- user reference
        user_id::text                                  as user_id,

        -- transaction type: cast from enum to plain text
        type::text                                     as tx_type,

        -- amount
        amount::numeric                                as amount,

        -- category: raw string from the app, normalized later in dim_category
        category_or_source                             as category_raw,

        -- description and tags
        description,
        tags,

        -- dates
        date                                           as transaction_date,
        created_at

    from source

)

select * from renamed