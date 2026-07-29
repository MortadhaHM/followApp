with source as (

    select * from {{ source('public', 'users') }}

),

renamed as (

    select
        row_number() over (order by created_at)  as user_key,
        id::text                                  as user_id,
        email,
        created_at::date                          as registered_at

    from source

)

select * from renamed