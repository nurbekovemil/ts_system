"use strict";
const fs = require("fs");
const path = require("path");
class TenderHandlers {
  constructor(readonly db) {
    this.db = db;
  }

  async createTender(
    { title, type, category, city, deadline, description },
    tender_files,
    { id }
  ) {
    const client = await this.db.connect();
    try {
      const { rows } = await client.query(
        `insert into tenders (title, user_id, type, status, category, city, deadline, description) values ($1,$2,$3,$4,$5,$6,$7,$8) returning id`,
        [title, id, type, 1, category, city, deadline, description]
      );
      if (tender_files) {
        tender_files.map(({ path }) =>
          client.query(
            "insert into tender_files (tender_id, path) values ($1, $2)",
            [rows[0].id, path]
          )
        );
      }

      return {
        message: "Объявление добавлено!",
      };
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }

  async getTenderList({ id, role }) {
    const client = await this.db.connect();
    try {
      const { rows } = await client.query(
        `
        select 
        t.id,
        t.title,
        t.status,
        ts.title as status_title,
        to_char(t.deadline, 'YYYY-MM-D') as deadline,
        to_char(t.created_at, 'YYYY-MM-DD, HH24:MI') as created_at,
        c.title as category_title,
        tt.title as type_title,
        tc.title as city_title
        from tenders t
        inner join tender_categories c on c.id = t.category
        inner join tender_types tt on tt.id = t.type
        inner join tender_cities tc on tc.id = t.city
        inner join tender_status ts on ts.id = t.status
        ${role == "TENDER" ? `where t.user_id = ${id}` : ""}
        order by t.created_at desc
      `
      );
      return rows;
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }

  async getTenderPrivateAllList() {
    const client = await this.db.connect();
    try {
      const { rows } = await client.query(
        `
        select 
        t.id,
        t.title,
        t.status,
        ts.title as status_title,
        to_char(t.deadline, 'YYYY-MM-D') as deadline,
        to_char(t.created_at, 'YYYY-MM-DD, HH24:MI') as created_at,
        c.title as category_title,
        tt.title as type_title,
        tc.title as city_title,
		    u.info
        from tenders t
        inner join tender_categories c on c.id = t.category
        inner join tender_types tt on tt.id = t.type
        inner join tender_cities tc on tc.id = t.city
        inner join tender_status ts on ts.id = t.status
		    inner join users u on u.id = t.user_id
        order by t.created_at desc
        
      `
      );
      return rows;
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }

  async getTenderPublicAllList() {
    const client = await this.db.connect();
    try {
      const { rows } = await client.query(
        `
        select 
        t.id,
        t.title,
        ts.title as status_title,
        to_char(t.deadline, 'YYYY-MM-D') as deadline,
        to_char(t.created_at, 'YYYY-MM-DD, HH24:MI') as created_at,
        c.title as category_title,
        tt.title as type_title,
        tc.title as city_title,
		    u.info
        from tenders t
        inner join tender_categories c on c.id = t.category
        inner join tender_types tt on tt.id = t.type
        inner join tender_cities tc on tc.id = t.city
        inner join tender_status ts on ts.id = t.status
		    inner join users u on u.id = t.user_id
        where t.status = 2
        order by t.created_at desc
      `
      );
      return rows;
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }

  async getTenderById({ id }) {
    const client = await this.db.connect();
    try {
      const { rows } = await client.query(
        `
        select 
        t.id,
        t.title,
        t.status,
        ts.title as status_title,
        to_char(t.deadline, 'YYYY-MM-DD') as deadline,
        to_char(t.created_at, 'YYYY-MM-DD, HH24:MI') as created_at,
        t.description,
        c.title as category_title,
        jsonb_agg(distinct tf.*) as tender_files,
        tt.title as type_title,
        tc.title as city_title,
        u.info
        from tenders t
        inner join tender_categories c on c.id = t.category
        inner join tender_types tt on tt.id = t.type
        inner join tender_cities tc on tc.id = t.city
        inner join users u on u.id = t.user_id
        inner join tender_status ts on ts.id = t.status
        left join tender_files tf on tf.tender_id = t.id
        where t.id = $1
        group by t.id, t.title, c.title, tt.title, tc.title, u.info, ts.title
        `,
        [id]
      );
      return rows[0];
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }

  async updateTenderStatus({ id, status }) {
    const client = await this.db.connect();
    try {
      const queryString = `
      update tenders set status = $1 where id = $2
      `;
      await client.query(queryString, [status, id]);

      return {
        message: "Статус тендера изменен!",
      };
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }

  async deleteTender({ id }) {
    const client = await this.db.connect();
    try {
      const { rows } = await client.query(
        `
        delete from tender_files where tender_id = $1 returning path
      `,
        [id]
      );
      rows.map(({ path }) => {
        fs.unlink(path, function (err) {
          if (err) throw err;
        });
      });
      await client.query(
        `
        delete from tenders where id = $1
      `,
        [id]
      );
      return {
        message: "Объявления удален!",
      };
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }
}

export default TenderHandlers;
