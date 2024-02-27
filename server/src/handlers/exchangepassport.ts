"use strict";
const fs = require("fs");
const path = require("path");
class ExchangePassportHandlers {
  constructor(readonly db) {
    this.db = db;
  }
  async createExchangePassport() {
    const client = await this.db.connect();
    try {
      return {
        message: "Объявление добавлено!",
      };
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }
  async getExchangePassportMyList({ id }) {
    const client = await this.db.connect();
    try {
      const { rows } = await client.query(
        `
        select 
        ep.id,
        ep.title,
        concat(d.deal_number, '-ТСС') as deal_number,
        to_char(ep.created_at, 'YYYY-MM-DD, HH24:MI') as created_at,
        o.title as order_title,
		count(epf.id) as documents
        from exchange_passports ep
        inner join deals d on d.id = ep.deal_id
        inner join orders o on o.id = d.order_from
		left join exchange_passport_files epf on epf.passport_id = ep.id
        where ep.user_id = $1
		group by ep.id, ep.title, o.title,  d.deal_number
      `,
        [id]
      );
      return rows;
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }
  async getExchangePassportAllList() {
    const client = await this.db.connect();
    try {
      const { rows } = await client.query(
        `
        select 
        ep.id,
        ep.title,
		concat(d.deal_number, '-ТСС')  as deal_number,
        to_char(ep.created_at, 'DD-MM-YYYY, HH24:MI') as created_at,
        o.title as order_title,
		count(epf.id) as documents
        from exchange_passports ep
        inner join deals d on d.id = ep.deal_id
        inner join orders o on o.id = d.order_from
		left join exchange_passport_files epf on epf.passport_id = ep.id
		group by ep.id, ep.title, o.title, d.deal_number
      `
      );
      return rows;
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }
  async getExchangePassportById(pid, uid) {
    const client = await this.db.connect();
    try {
      const { rows } = await client.query(
        `
        select 
        concat('ID ',ep.id) as pid,
        ep.id,
        ep.title,
        ep.deal_id,
		u.info,
        case when ep.user_id = $2 then true else false end as own,
        to_char(ep.created_at, 'YYYY-MM-DD, HH24:MI') as created_at,
        jsonb_agg(
			distinct jsonb_build_object(
				'id', epf.id, 
				'passport_id', epf.passport_id,
				'path',epf.path, 
				'created_at', to_char(epf.created_at, 'DD-MM-YYYY, HH24:MI')
			)
		) filter (where epf.id is not null and epf.type = 2) as passport_files_invoice,
		jsonb_agg(
			distinct jsonb_build_object(
				'id', epf.id, 
				'passport_id', epf.passport_id,
				'path',epf.path, 
				'created_at', to_char(epf.created_at, 'DD-MM-YYYY, HH24:MI')
			)
		) filter (where epf.id is not null and epf.type = 1) as passport_files_deal,
        o.title as order_title
        from exchange_passports ep
        inner join deals d on d.id = ep.deal_id
        inner join orders o on o.id = d.order_from
		left join exchange_passport_files epf on epf.passport_id = ep.id
		inner join users u on u.id = ep.user_id
        where ep.id = $1
		    group by ep.id, ep.title, ep.deal_id, o.title, u.info
      `,
        [pid.id, uid.id]
      );
      return rows[0];
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }
  async uploadExchangePassportFiles({ passport_id, type }, passports) {
    const client = await this.db.connect();
    try {
      passports.map(({ path }) => {
        client.query(
          "insert into exchange_passport_files (passport_id, path, type) values ($1, $2, $3)",
          [passport_id, path, type]
        );
      });
      return {
        message: "Файл успешно загружен!",
      };
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }
  async deleteExchangePassportFileById({ id }) {
    const client = await this.db.connect();
    try {
      const { rows } = await client.query(
        `
        delete from exchange_passport_files where id = $1 returning path
        `,
        [id]
      );
      fs.unlink(rows[0].path, function (err) {
        if (err) throw err;
      });
      return {
        message: "Документ успешно удален!",
      };
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }

  async createRegPayments({ title, user_from, user_to, passport_id }) {
    const client = await this.db.connect();
    try {
      await client.query(
        `
        insert into registration_payments (title, user_from, user_to, passport_id) values ($1, $2, $3, $4)
      `,
        [title, user_from, user_to, passport_id]
      );
      return {
        message: "Платеж успешно зарегистрирован!",
      };
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }

  async getPassportRegPays({ id }) {
    const client = await this.db.connect();
    try {
      const { rows } = await client.query(
        `
        select
        ep.id,
        concat(ep.title, ' ID', ep.id) as title,
        jsonb_agg(
          distinct jsonb_build_object(
                'id', rp.id, 
                'title', rp.title, 
                'user_from', rp.user_from,
                'user_to', rp.user_to,
                'user_from_name', uf.info::json#>>'{0,items,1,value}',
                'user_to_name', ut.info::json#>>'{0,items,1,value}',
                'created_at', to_char(rp.created_at, 'DD-MM-YYYY, HH24:MI')
              )
            ) filter (where rp.passport_id = $1) as reg_pays
        from exchange_passports ep
        inner join registration_payments rp on rp.passport_id = ep.id
        inner join users uf on uf.id = rp.user_from
        inner join users ut on ut.id = rp.user_to
        where ep.id = $1
        group by ep.title, ep.id
        `,
        [id]
      );
      console.log(rows);
      return rows;
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }
  async getRegPayAllList() {
    const client = await this.db.connect();
    try {
      const { rows } = await client.query(
        `
        select
        rp.id,
        rp.title,
        uf.info::json#>>'{0,items,1,value}' as user_from_name,
        ut.info::json#>>'{0,items,1,value}' as user_to_name,
        to_char(created_at, 'DD-MM-YYYY') as created_at
        from registration_payments rp
        inner join users uf on uf.id = rp.user_from
        inner join users ut on ut.id = rp.user_to
      `
      );
      return rows;
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }
  async updateRegPayById({ title, company_name, id }) {
    const client = await this.db.connect();
    try {
      const { rows } = await client.query(
        `
        update registration_payments set title = $1, company_name = $2 where id = $3
      `,
        [title, company_name, id]
      );
      return {
        message: "Данные успешно обновлены!",
      };
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }
  async deleteRegPayById({ id }) {
    const client = await this.db.connect();
    try {
      const { rows } = await client.query(
        `
        delete from registration_payments where id = $1
      `,
        [id]
      );
      return {
        message: "Регистрация успешно удален!",
      };
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }
}

export default ExchangePassportHandlers;
