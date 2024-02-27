"use strict";
const fs = require("fs");
const path = require("path");
class ShowcaseHandlers {
  constructor(readonly db) {
    this.db = db;
  }

  async createProd(
    { id },
    { title, description, total, price, vendor_code },
    files
  ) {
    const client = await this.db.connect();
    try {
      const { rows } = await client.query(
        `
        insert into showcases (user_id, title,  description, total, price, vendor_code) values ($1, $2, $3, $4, $5, $6) returning id
      `,
        [id, title, description, total, price, vendor_code]
      );

      files != undefined &&
        (await files.map(
          async ({ path }) =>
            await client.query(
              "insert into showcase_files (showcase_id, path) values ($1, $2)",
              [rows[0].id, path]
            )
        ));
      return {
        message: "Опубликовано!",
      };
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }
  async getProdById({ id }) {
    const client = await this.db.connect();
    try {
      const { rows } = await client.query(
        `
        select
        s.title,
        s.description,
        s.total,
        s.price,
        s.vendor_code,
        to_char(s.created_at, 'YYYY-MM-DD, HH24:MI') as created_at,
        jsonb_agg(distinct sf.*) as images
        from showcases s
        left join showcase_files sf on sf.showcase_id = s.id
        where s.id = $1
        group by s.title, s.description, s.created_at, s.total,
        s.price,
        s.vendor_code
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
  async getProdList() {
    const client = await this.db.connect();
    try {
      const { rows } = await client.query(`
      select
      s.id,
      s.title,
      s.description,
      s.total,
      s.price,
      jsonb_agg(distinct sf.*) as images,
      to_char(s.created_at, 'YYYY-MM-DD, HH24:MI') as created_at
      from showcases s
      left join showcase_files sf on sf.showcase_id = s.id
	  group by s.id
      order by s.created_at desc

      `);
      return rows;
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }
  async deleteProdById({ id }) {
    const client = await this.db.connect();
    try {
      const { rows } = await client.query(
        `
        delete from showcase_files where showcase_id = $1 returning path
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
          delete from showcases where id = $1
        `,
        [id]
      );
      return {
        message: "Продукт удален!",
      };
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }
  async deleteProdImage({ id }) {
    const client = await this.db.connect();
    try {
      const { rows } = await client.query(
        `
          delete from showcase_files where showcase_id = $1 returning path
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
          delete from showcases where id = $1
        `,
        [id]
      );
      return {
        message: "Продукт удален!",
      };
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }
}

export default ShowcaseHandlers;
