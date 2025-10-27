import { db } from "@config/database";
import { contacts, users, products } from "@/database/schema";
import { eq } from "drizzle-orm";
import type { CreateContactData } from "@/types/requests";

export class UserRepository {
  async getContacts() {
    return await db.select().from(contacts);
  }

  async getContact(id: number) {
    const result = await db.select().from(contacts).where(eq(contacts.id, id));
    return result[0] || null;
  }

  async addContact(contactData: CreateContactData) {
    const result = await db
      .insert(contacts)
      .values({
        fio: contactData.fio,
        phone: contactData.phone,
        address: contactData.address,
        house: contactData.house,
        agreement: contactData.agreement,
        email: contactData.email,
        tags: contactData.tags || {
          source: "website_form",
          timestamp: new Date().toISOString(),
        },
      })
      .returning();

    return result.length > 0;
  }

  async updateContact(id: number, contactData: any) {
    const result = await db
      .update(contacts)
      .set({ ...contactData, updatedAt: new Date() })
      .where(eq(contacts.id, id))
      .returning();

    return result.length > 0;
  }

  async deleteContact(id: number) {
    const result = await db
      .delete(contacts)
      .where(eq(contacts.id, id))
      .returning();

    return result.length > 0;
  }

  async findByUsername(username: string) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return result[0] || null;
  }

  async updateRefreshToken(username: string, refreshToken: string | null) {
    await db
      .update(users)
      .set({
        lastToken: refreshToken,
        updatedAt: new Date(),
      })
      .where(eq(users.username, username));
  }

  // === PRODUCTS === (заготовка на будущее)
  async getProducts() {
    return await db.select().from(products);
  }

  async getProduct(id: number) {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0] || null;
  }
}
