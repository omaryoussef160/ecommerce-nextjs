import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import PromoCode from '@/models/PromoCode';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const promoCodes = await PromoCode.find().sort({ createdAt: -1 });
    return NextResponse.json({ promoCodes });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { code, discount, type, minOrder, maxUses, expiresAt } = await req.json();

    const promo = await PromoCode.create({
      code: code.toUpperCase(),
      discount,
      type,
      minOrder,
      maxUses,
      expiresAt,
    });

    return NextResponse.json({ message: 'Promo code created', promo }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Promo code already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
