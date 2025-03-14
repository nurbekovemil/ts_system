"use strict";

class ReportHandlers {
  constructor(readonly db) {
    this.db = db;
  }
  async getDealReports({ search_name, date_from, date_to, is_members }) {
    const client = await this.db.connect();
    try {
      let queryString = `
        select
        d.id,
        to_char(d.created_at, 'DD.MM.YYYY') as created_at,
        u_f.username as user_from_name,
        u_t.username as user_to_name,
        o.title as prod_title,
        o.price,
        o.amount,
        o_w.title as prod_weight,
        o.cost,
        o.code_tnved,
        o_c.symbol
        from deals d
        inner join orders o on o.id = d.order_from
        inner join users u_f on d.user_from = u_f.id
        inner join users u_t on d.user_to = u_t.id
        inner join order_weights o_w on o_w.id = o.weight
        inner join order_currencies o_c on o_c.id = o.currency 
        where d.status in(5,2,6)
        ${date_from ? ` and d.created_at >= '${date_from} 00:00:00'` : ""}
        ${date_to ? ` and d.created_at <= '${date_to} 23:59:59'` : ""}
        ${
          search_name.trim() != "" && is_members
            ? ` and u_f.username like '%${search_name}%' or u_t.username like '%${search_name}%'`
            : ""
        }
        order by d.created_at desc
        `;
        console.log('getDealReports querystring: ', queryString)
      const { rows } = await client.query(queryString);
      return rows;
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }

  async getCommissionReport({ date_from, date_to }) {
    const client = await this.db.connect();
    try {
      // select
      // u.info :: json #>>'{0,items,1,value}' as username,
      // sum(o.cost) as costs,
      // round(sum((o.cost * 0.05) / 100)/ 2, 2) as precent,
      // count(d.*) as deal_count
      // from users u
      // inner join orders o on o.user_id = u.id
      // inner join deals d on d.order_from = o.id or d.order_to = o.id
      // where o.user_id = u.id and d.status in (5, 2) and u.role = 2 ${dateQuery}
      // group by u.id

      let queryString = `
      select
      u.info :: json #>>'{0,items,1,value}' as username,
      sum(o.cost) as costs,
      case 
	  	when round(sum((o.cost * 0.05) / 100)/ 2, 2) >= '50000' then '50000' 
      when round(sum((o.cost * 0.05) / 100)/ 2, 2) <= '200' then '200'
      else round(sum((o.cost * 0.05) / 100)/ 2, 2)
      end as precent,
      count(d.*) as deal_count
      from users u
      inner join deals d on d.user_from = u.id or d.user_to = u.id
      inner join orders o on o.id = d.order_from
      where d.status in (5, 2, 6) and u.role = 2 
        ${
          date_from && date_from == date_to
            ? ` and d.created_at >='${date_from} 00:00:00' `
            : date_from
            ? ` and d.created_at >= '${date_from} 00:00:00' and d.created_at < '${date_to} 23:59:59' `
            : date_to
            ? ` and d.created_at <= '${date_to} 23:59:59' `
            : " "
        }
      group by u.id
      `;
      console.log('getCommissionReport querystring: ',queryString)
      const { rows } = await client.query(queryString);
      return rows;
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }

  async getCommissionReportDetail({ date_from, date_to }) {
    const client = await this.db.connect();
    try {
      let queryString = `
      select
      u.id,
      u.info :: json #>>'{0,items,1,value}' as username,
	    jsonb_agg(
        distinct jsonb_build_object(
              'id', o.id, 
        'title', o.title,
        'cost', o.cost,
        'price', o.price,
        'amount', o.amount,
        'deal_number', d.deal_number,
        'created_at',  to_char(d.created_at, 'DD.MM.YYYY'),
        'commission_report', 
			  CASE
                WHEN round(((o.cost * 0.05) / 100) / 2, 2) > 50000 THEN 50000
                ELSE round(((o.cost * 0.05) / 100) / 2, 2)
        END
      )
      ) as deals
      from users u
      inner join deals d on d.user_from = u.id or d.user_to = u.id
      inner join orders o on o.id = d.order_from
      where d.status in (5, 2, 6) and u.role = 2
        ${
          date_from && date_from == date_to ? ` and d.created_at >='${date_from}' `
            : date_from ? ` and d.created_at >= '${date_from}' and d.created_at <= '${date_to}' ` : date_to
            ? ` and d.created_at <= '${date_to}' ` : " "
        }
      group by u.id
      `;
      console.log('getCommissionReportDetail querystring: ',queryString)
      const { rows } = await client.query(queryString);
      return rows;
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }
}

export default ReportHandlers;
