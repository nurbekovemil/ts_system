"use strict";

class DealHandlers {
  constructor(readonly db, readonly jwt) {
    this.db = db;
    this.jwt = jwt;
  }

  async createDeal(user_from, user_to, order_from, order_to) {
    const client = await this.db.connect();
    try {
      let deal_status = 1;
      const orderfrom = await client.query(
        "select * from orders where id = $1",
        [order_from]
      );
      const orderto = await client.query("select * from orders where id = $1", [
        order_to,
      ]);
      // Если пользователь хочет купить/предложить больше чем указано в количестве
      if (orderfrom.rows[0].amount > orderto.rows[0].amount) {
        await client.query("delete from orders where id = $1", [order_from]);
        throw new Error(
          `Вы можете купить/предложить ${orderto.rows[0].amount} количество!`
        );
      }
      // Двойной встречный аукцион start code
      if (!orderfrom.rows[0].is_auction) {
        deal_status = 5;
        if (orderfrom.rows[0].amount < orderto.rows[0].amount) {
          await client.query(
            `update orders 
              set amount = orders.amount - ${orderfrom.rows[0].amount}, 
              cost = orders.cost - ${orderfrom.rows[0].cost}
              where id = $1`,
            [order_to]
          );
        }
        if (orderfrom.rows[0].amount == orderto.rows[0].amount) {
          await client.query("update orders set status = 3 where id = $1", [
            order_to,
          ]);
        }
      }
      // Добавляем новую сделку
      const deal = await client.query(
        `insert into deals (user_from, user_to, order_from, order_to, status) 
				values($1, $2, $3, $4, $5) returning id`,
        [user_from, user_to, order_from, order_to, deal_status]
      );
      deal_status == 5 &&
        (await client.query(
          `insert into exchange_passports (title, deal_id, user_id) values ('Биржевой паспорт', $1, $2) `,
          [
            deal.rows[0].id,
            orderfrom.rows[0].order_type == 1 ? user_from : user_to,
          ]
        ));
      // Статус заявки отправителя "Предложения"
      await client.query("update orders set status = 8 where id = $1", [
        order_from,
      ]);

      return {
        message: "Предложение успешно отправлен!",
      };
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }

  async getDeals(user_id, status) {
    const client = await this.db.connect();
    try {
      const { rows } = await client.query(
        `
         select
         (select title from orders where user_id = user_from and id = order_from) as title_order_from,
         (select title from orders where user_id = user_to and id = order_to) as title_order_to,
         case when user_from = $1 then true else false end as own,
         user_from, 
         user_to, 
         order_from, 
         order_to, 
         deals.id,
         to_char("created_at", 'DD.MM.YYYY') as created_at,
         deals.status,
         deal_status.title as status_title,
         deal_status.color as status_color,
         uf.username as from_username,
         ut.username as to_username
         from deals 
         inner join deal_status on deals.status = deal_status.id
         inner join users uf on deals.user_from = uf.id
         inner join users ut on deals.user_to = ut.id
         where ${
           status == 2
             ? "(deals.status = 2 or deals.status = 4 or deals.status = 5 or deals.status = 6)"
             : "(deals.status = 1 or deals.status = 3)"
         } and (user_from = $1 or user_to = $1)
         order by created_at desc
         `,
        [user_id]
      );
      return rows;
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }

  async getDealById(deal_id, user_id) {
    const client = await this.db.connect();
    try {
      const { rows } = await client.query(
        `            
        select 
        d.*, 
        to_char(d.created_at, 'DD.MM.YYYY') as created_at,
        u_f.username as user_from_name,
        u_t.username as user_to_name,
        u_f.info as user_from_info,
        u_t.info as user_to_info,
        ds.title as status_title, 
        ds.color as status_color,
        o_f.order_type as order_type_from,
        o_f.title,
        o_f.cost,
        o_f.amount,
        o_f.price,
        o_f.description,
        o_f.special_conditions,
        o_f.packing_form,
        o_f.country,
        o_f.code_tnved,
        o_f.product_location,
        o_f.delivery_date,
        o_f.payment_date,
        o_f.marking,
        o_f.quality,
        oc.title category,
        od.title delivery,
        op.title payment,
        ow.title weight,
        order_currencies.symbol as currency_symbol,
        order_currencies.title as currency_title,
        o_t.order_type as order_type_to,
        case when d.user_from = $2 then true else false end as own
        from deals d 
        inner join deal_status ds on ds.id = d.status 
        inner join users u_f on d.user_from = u_f.id 
        inner join users u_t on d.user_to = u_t.id
        inner join orders o_f on o_f.id = d.order_from
        inner join orders o_t on o_t.id = d.order_to
        inner join order_categories as oc on o_f.category = oc.id
        inner join order_deliveries as od on o_f.delivery = od.id
        inner join order_payments as op on o_f.payment = op.id
        inner join order_weights as ow on o_f.weight = ow.id 
        inner join order_currencies on order_currencies.id = o_f.currency
        where d.id = $1
         `,
        [deal_id, user_id]
      );
      const comments = await this.getDealComments(deal_id);
      return { deal: rows[0], comments };
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }

  async getDealComments(deal_id) {
    const client = await this.db.connect();
    try {
      const { rows } = await client.query(
        `
        select 
        dc.comment,
        to_char(dc.created_at, 'DD.MM.YYYY,  HH24:MI:SS') as created_at,
        u.username,
        df.path as file_path
        from deal_comments dc
        inner join users u on u.id = dc.user_id
        left join deal_files df on df.comment_id = dc.id
        where deal_id = $1
				`,
        [deal_id]
      );
      return rows;
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }

  async getDealOrders(deal_id, user_id) {
    const client = await this.db.connect();
    try {
      const { rows } = await client.query(
        `
         select 
         o.*,
         case when o.user_id = $2 then true else false end as own,
         to_char(o.created_at, 'DD.MM.YYYY') as created_at,
         ot.title as order_type_title,
         os.title as status_title,
         oc.title as category,
         od.title as delivery,
         op.title as payment,
         ow.title as weight,
         cu.symbol as currency_symbol,
         to_char(o.auction_date_start, 'DD.MM.YYYY') as auction_date_start,
        to_char(o.auction_date_end, 'DD.MM.YYYY') as auction_date_end,
		 jsonb_agg(img.*) as images
         from deals d
         inner join orders o on d.order_from = o.id or d.order_to = o.id
         inner join order_types as ot on o.order_type = ot.id 
         inner join order_status as os on o.status = os.id
         inner join order_categories as oc on o.category = oc.id
         inner join order_deliveries as od on o.delivery = od.id
         inner join order_payments as op on o.payment = op.id
         inner join order_weights as ow on o.weight = ow.id 
         inner join order_currencies as cu on o.currency = cu.id
		 left join path_images as img on o.id = img.order_id
         where d.id = $1
		group by 
		 o.id,
				 ot.title,
         os.title,
         oc.title,
         od.title,
         op.title,
         ow.title,
         cu.symbol
				 `,
        [deal_id, user_id]
      );
      return rows;
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }

  async updateDealStatus(status, deal_id) {
    const client = await this.db.connect();
    try {
      const { rows } = await client.query("select * from deals where id = $1", [
        deal_id,
      ]);
      let { order_from, order_to, user_from, user_to, id } = rows[0];
      // получаем количество и стоимость заявки покупателя
      const orderfrom = await client.query(
        "select amount, cost, order_type from orders where id = $1",
        [order_from]
      );
      // получаем количество и стоимость заяки продавца
      const orderto = await client.query(
        "select amount from orders where id = $1",
        [order_to]
      );

      // Статус заявки "Принять на исполнение"
      if (status === 5) {
        // если количество больше тогда отказываемся принять
        if (orderfrom.rows[0].amount > orderto.rows[0].amount) {
          throw new Error("Недостаточно количество!");
        }
        // если количество равно тогда закрываем заявку
        if (orderfrom.rows[0].amount == orderto.rows[0].amount) {
          await client.query("update orders set status = 3 where id = $1", [
            order_to,
          ]);
        }
        if (orderfrom.rows[0].amount < orderto.rows[0].amount) {
          await client.query(
            `update orders 
              set amount = orders.amount - ${orderfrom.rows[0].amount}, 
              cost = orders.cost - ${orderfrom.rows[0].cost}
              where id = $1`,
            [order_to]
          );
        }

        await client.query(
          `insert into exchange_passports (title, deal_id, user_id) values ('Биржевой паспорт', $1, $2) `,
          [deal_id, orderfrom.rows[0].order_type == 1 ? user_from : user_to]
        );
      }
      // Статус заявки "Состоялось"
      if (status === 2) {
        let transfer_status = 1;
        let userfrom = await client.query(
          ` select uc.*, u.username, r.role
            from user_accounts uc
            inner join users u on u.id = uc.user_id
            inner join roles r on r.id = u.role
            where uc.user_id = $1`,
          [user_from]
        );
        const updateUserAccounts = async (user_id, action, total) =>
          await client.query(
            `update user_accounts set count = count ${action} '${total}' where user_id = ${user_id}`
          );
        if (
          parseInt(userfrom.rows[0].count) >= parseInt(orderfrom.rows[0].cost)
        ) {
          transfer_status = 2;
          await updateUserAccounts(user_from, "-", orderfrom.rows[0].cost);
          await updateUserAccounts(user_to, "+", orderfrom.rows[0].cost);
        }
        // create transaction after confirm
        let queryString = `insert into transactions (type, user_from, user_to, amount, status, deal_id) values ($1, $2, $3, $4, $5, $6)`;
        await client.query(queryString, [
          3,
          user_from,
          user_to,
          orderfrom.rows[0].cost,
          transfer_status,
          id,
        ]);
      }
      const queryString = `update deals set status = ${status} ${
        status == 5 ? ",created_at = NOW()" : ""
      } where id = ${deal_id}`;
      await client.query(queryString);
      return {
        message:
          status == 2 || status == 1 || status == 5 || status == 6
            ? "Принято!"
            : "Предложение отклонен!",
      };
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }

  async getOfferHistory({ id }) {
    const client = await this.db.connect();
    try {
      const { rows } = await client.query(
        `
      select 
      o.id, 
      o.title, 
      o.amount,
      o.price,
      o.cost,
      to_char(d.created_at, 'DD.MM.YYYY') as created_at,
      oc.symbol as currency_symbol,
      ow.title as order_weight
      from deals d 
      inner join orders o 
      on o.id = d.order_from 
      inner join order_currencies oc
      on o.currency = oc.id
      inner join order_weights ow
      on ow.id = o.weight
      where d.order_to = $1 and d.status = 1
      order by o.cost desc
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

  async deleteOffer({ id }) {
    const client = await this.db.connect();
    try {
      await client.query(`delete from deals where id = $1`, [id]);
      return {
        message: "Предложения удалено!",
      };
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }

  async getTrageList({ date }) {
    const client = await this.db.connect();
    try {
      const { rows } = await client.query(`
      select 
      d.*, 
      to_char(d.created_at, 'DD.MM.YYYY') as created_at,
      u_f.username as user_from_name,
      u_t.username as user_to_name,
      o_f.order_type as order_type_from,
      o_f.title,
      o_f.cost,
      o_f.amount,
      o_f.price,
      o_f.code_tnved,
      ow.title weight,
      order_currencies.symbol as currency_symbol,
      order_currencies.title as currency_title
      from deals d 
      inner join deal_status ds on ds.id = d.status 
      inner join users u_f on d.user_from = u_f.id 
      inner join users u_t on d.user_to = u_t.id
      inner join orders o_f on o_f.id = d.order_from
      inner join orders o_t on o_t.id = d.order_to
      inner join order_weights as ow on o_f.weight = ow.id 
      inner join order_currencies on order_currencies.id = o_f.currency
      where d.status in (2,5,6) ${
        date != "all"
          ? `and d.created_at >= NOW() - INTERVAL '${date} day'`
          : ""
      } 
      `);
      return rows;
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }

  async getTradeById({ id }) {
    const client = await this.db.connect();
    try {
      const { rows } = await client.query(
        `            
        select 
        d.*, 
        to_char(d.created_at, 'DD.MM.YYYY') as created_at,
        u_f.username as user_from_name,
        u_t.username as user_to_name,
        u_f.info as user_from_info,
        u_t.info as user_to_info,
        ds.title as status_title, 
        ds.color as status_color,
        o_f.order_type as order_type_from,
        o_f.title,
        o_f.cost,
        o_f.amount,
        o_f.price,
        o_f.description,
        o_f.special_conditions,
        o_f.packing_form,
        o_f.country,
        o_f.code_tnved,
        o_f.product_location,
        o_f.delivery_date,
        o_f.payment_date,
        o_f.marking,
        o_f.quality,
        oc.title category,
        od.title delivery,
        op.title payment,
        ow.title weight,
        order_currencies.symbol as currency_symbol,
        order_currencies.title as currency_title,
        o_t.order_type as order_type_to
        from deals d 
        inner join deal_status ds on ds.id = d.status 
        inner join users u_f on d.user_from = u_f.id 
        inner join users u_t on d.user_to = u_t.id
        inner join orders o_f on o_f.id = d.order_from
        inner join orders o_t on o_t.id = d.order_to
        inner join order_categories as oc on o_f.category = oc.id
        inner join order_deliveries as od on o_f.delivery = od.id
        inner join order_payments as op on o_f.payment = op.id
        inner join order_weights as ow on o_f.weight = ow.id 
        inner join order_currencies on order_currencies.id = o_f.currency
        where d.id = $1
         `,
        [id]
      );
      const comments = await this.getDealComments(id);
      return { deal: rows[0], comments };
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }
  async getDepoDeals({ date }) {
    const client = await this.db.connect();
    try {
      const { rows } = await client.query(
        `
         select
         (select title from orders where user_id = user_from and id = order_from) as title_order_from,
         (select title from orders where user_id = user_to and id = order_to) as title_order_to,
         user_from, 
         user_to, 
         order_from, 
         order_to, 
         deals.id,
         to_char("created_at", 'DD.MM.YYYY') as created_at,
         deals.status,
         deal_status.title as status_title,
         deal_status.color as status_color,
         uf.username as from_username,
         ut.username as to_username
         from deals 
         inner join deal_status on deals.status = deal_status.id
         inner join users uf on deals.user_from = uf.id
         inner join users ut on deals.user_to = ut.id
         where deals.status in (2,4,6,5) ${
           date != "all"
             ? `and deals.created_at >= NOW() - INTERVAL '${date} day'`
             : ""
         } 
         order by created_at desc
         `
      );
      return rows;
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }

  async updateDealWithComment({ status, deal_id, comment }, files, user_id) {
    const client = await this.db.connect();
    try {
      await this.updateDealStatus(status, deal_id);
      const { rows } = await client.query(
        `
        insert into deal_comments (deal_id, user_id, comment) values ($1, $2, $3) returning id
      `,
        [deal_id, user_id, comment]
      );
      const queryString =
        "insert into deal_files (comment_id, path) values ($1, $2)";
      files.map((item) => {
        client.query(queryString, [rows[0].id, item.path]);
      });
      return {
        message: "Комментарии добавлено",
      };
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }
  async addDealNumber(deal_id, deal_number) {
    const client = await this.db.connect();
    try {
      if (deal_number) {
        await client.query(
          `
            update deals set deal_number = $1 where id = $2
          `,
          [deal_number, deal_id]
        );
      }
      return {
        message: deal_number ? "Номер добавлен!" : "Введите номер!",
      };
    } catch (error) {
      return error;
    } finally {
      client.release();
    }
  }
}

export default DealHandlers;
