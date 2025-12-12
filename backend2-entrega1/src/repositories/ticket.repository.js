import { ticketModel } from '../dao/models/ticket.model.js';

class TicketRepository {
  async create(data) {
    return ticketModel.create(data);
  }

  async getByCode(code) {
    return ticketModel.findOne({ code }).lean();
  }
}

const ticketRepository = new TicketRepository();
export default ticketRepository;