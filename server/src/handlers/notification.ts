"use strict";
class NotificationHandlers {
  constructor(readonly db) {
    this.db = db;
  }


  async createNotification({ id }, data) {
    const table = `CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    user_from VARCHAR(255) NOT NULL,
    user_to VARCHAR(255) NOT NULL,
    is_read INT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`
    const client = await this.db.connect();
    try {
      const { title, content, user_from, user_to } = data;
      await client.query(
        `
        insert into notifications (title, content, user_from, user_to, is_read) values ($1, $2, $3, $4, $5) returning id
      `,
        [title, content, user_from, user_to, [id]]
      );
      return {
        message: "Отправлено!",
      };
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }

  async updateNotification(data){
    const client = await this.db.connect();
    try {
      await client.query(
        `
        update notifications set title = $1, content = $2, user_to = $3 where id = $4
      `,
        [data.title, data.content, data.user_to, data.id]
      )
      return {
        message: "Обновлено!",
      };
    }catch (error) {
      return error;
    } finally {
      client.release();
    }
  }
  async getNotificationById({ id: user_id }, {nid}) {
    const client = await this.db.connect();
    try {
      const { rows } = await client.query(
        `
        select 
        n.*,
        to_char(n.created_at, 'DD.MM.YYYY, HH24:MI') as created_at,
        u_f.info :: json #>>'{0,items,1,value}' as user_from_company,
        u_t.info :: json #>>'{0,items,1,value}' as user_to_company
        from notifications n 
        inner join users u_f on n.user_from = u_f.username
        inner join users u_t on n.user_to = u_t.username
        where n.id = $1`,
        [nid]
      );
      if (rows.length === 0) {
        return { message: "Уведомление не найдено" };
      }
  
      // Добавляем user_id в массив, если его там нет
      await client.query(
        `UPDATE notifications 
         SET is_read = array_append(is_read, $2) 
         WHERE id = $1 AND NOT ($2 = ANY(is_read))`,
        [nid, user_id]
      );
      return rows[0];
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }
  async deleteNotificationById({ id }) {
    const client = await this.db.connect();
    try {
      await client.query(
        `delete from notifications where id = $1`,
        [id]
      );
      return {
        message: "Удалено!",
      };
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }

  async getNotifications({ id }) {
    const client = await this.db.connect();
    try {
      const { rows: user} = await client.query('select * from users where id = $1', [id]);
      const { rows } = await client.query(
        `select 
          n.*,
          CASE 
            WHEN $2 = ANY(n.is_read) THEN true 
              ELSE false 
          END AS is_read_status,
          u_f.info :: json #>>'{0,items,1,value}' as user_from_company,
          u_t.info :: json #>>'{0,items,1,value}' as user_to_company,
          to_char(n.created_at, 'DD.MM.YYYY, HH24:MI') as created_at
        from notifications n
        inner join users u_f on n.user_from = u_f.username
        inner join users u_t on n.user_to = u_t.username
        where user_from = $1 
        or 
        user_to = $1 
        order by n.created_at desc`,
        [user[0].username, id]
      );
      return rows;
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }

  async getCountUnreadNotifications({ id }) {
    const client = await this.db.connect();
    try {
      const { rows: user} = await client.query('select * from users where id = $1', [id]);
      const { rows } = await client.query(
        `SELECT COUNT(*) AS unread_count
          FROM notifications
          WHERE (user_from = $1 OR user_to = $1)
          AND NOT ($2 = ANY(is_read));
        `,
        [user[0].username, id]
      );
      return rows[0];
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }
}

export default NotificationHandlers;
