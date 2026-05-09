import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PromoCode from '@/models/PromoCode';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { code, orderTotal } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const promo = await PromoCode.findOne({
      code: code.toUpperCase(),
      isActive: true,
      expiresAt: { $gt: new Date() },
    });

    if (!promo) {
      return NextResponse.json({ error: 'Invalid or expired promo code' }, { status: 400 });
    }

    if (promo.usedCount >= promo.maxUses) {
      return NextResponse.json({ error: 'Promo code has reached its limit' }, { status: 400 });
    }

    if (orderTotal < promo.minOrder) {
      return NextResponse.json(
        { error: `Minimum order amount is $${promo.minOrder}` },
        { status: 400 }
      );
    }

    const discountAmount =
      promo.type === 'percentage'
        ? (orderTotal * promo.discount) / 100
        : promo.discount;

    return NextResponse.json({
      valid: true,
      discount: discountAmount,
      type: promo.type,
      percentage: promo.discount,
      message: `${promo.type === 'percentage' ? promo.discount + '%' : '$' + promo.discount} discount applied!`,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
