select *
from {{ ref('dim_date_seed') }}
where full_date <= current_date