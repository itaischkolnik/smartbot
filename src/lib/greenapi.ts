import axios from 'axios';

export type GreenAPIConfig = {
  idInstance: string;
  apiTokenInstance: string;
};

export class GreenAPIClient {
  private baseUrl: string;
  private idInstance: string;
  private apiTokenInstance: string;

  constructor(config: GreenAPIConfig) {
    this.idInstance = config.idInstance;
    this.apiTokenInstance = config.apiTokenInstance;
    this.baseUrl = `https://api.green-api.com/waInstance${this.idInstance}`;
  }

  async sendMessage(phoneNumber: string, message: string): Promise<boolean> {
    try {
      const endpoint = `${this.baseUrl}/SendMessage/${this.apiTokenInstance}`;
      const response = await axios.post(endpoint, {
        chatId: `${phoneNumber}@c.us`,
        message,
      });

      return response.data.idMessage !== undefined;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return false;
    }
  }

  async receiveNotification(): Promise<any> {
    try {
      const endpoint = `${this.baseUrl}/ReceiveNotification/${this.apiTokenInstance}`;
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error receiving notification:', error);
      return null;
    }
  }

  async deleteNotification(receiptId: number): Promise<boolean> {
    try {
      const endpoint = `${this.baseUrl}/DeleteNotification/${this.apiTokenInstance}/${receiptId}`;
      const response = await axios.delete(endpoint);
      return response.data.result;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }
}

// Create a singleton instance using environment variables
export const greenAPI = new GreenAPIClient({
  idInstance: process.env.GREENAPI_INSTANCE_ID!,
  apiTokenInstance: process.env.GREENAPI_API_TOKEN!,
}); 