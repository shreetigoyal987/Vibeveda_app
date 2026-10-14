import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Tag, 
  CheckCircle2, 
  CreditCard,
  Truck,
  RotateCcw
} from 'lucide-react';
import { CartItem, Order } from '../types/veda.ts';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  updateQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  onOrderPlaced: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  updateQuantity,
  removeFromCart,
  clearCart,
  onOrderPlaced,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoMsg, setPromoMsg] = useState<{ text: string; success: boolean } | null>(null);

  // Checkout modal states
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'success'>('form');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Form fields
  const [fullName, setFullName] = useState('Shreeti Goyal');
  const [email, setEmail] = useState('shreetigoyal2109@gmail.com');
  const [street, setStreet] = useState('42 Veda Sanctum Way, Suite 108');
  const [city, setCity] = useState('San Francisco');
  const [postalCode, setPostalCode] = useState('94107');
  const [country, setCountry] = useState('United States');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'upi'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculations
  const rawSubtotal = cart.reduce((acc, item) => {
    const itemPrice = item.isSubscription ? item.product.subscriptionPrice : item.product.price;
    return acc + itemPrice * item.quantity;
  }, 0);

  const discountAmount = (rawSubtotal * appliedDiscount) / 100;
  const freeShippingThreshold = 95;
  const isFreeShipping = rawSubtotal >= freeShippingThreshold || rawSubtotal === 0;
  const shippingCost = isFreeShipping ? 0 : 9.5;
  const totalAmount = Math.max(0, rawSubtotal - discountAmount + shippingCost);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    if (clean === 'VEDA15') {
      setAppliedDiscount(15);
      setPromoMsg({ text: '15% Sacred Apothecary Discount applied!', success: true });
    } else if (clean === 'OJAS20') {
      setAppliedDiscount(20);
      setPromoMsg({ text: '20% Ojas Master Discount applied!', success: true });
    } else {
      setPromoMsg({ text: 'Invalid invitation code. Try VEDA15 or OJAS20', success: false });
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const order: Order = {
        id: `VV-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        items: [...cart],
        total: totalAmount,
        discount: discountAmount,
        shippingAddress: {
          fullName,
          street,
          city,
          postalCode,
          country,
        },
        paymentMethod:
          paymentMethod === 'card'
            ? 'Credit Card (Stripe Encrypted)'
            : paymentMethod === 'apple_pay'
            ? 'Apple Pay / Digital Wallet'
            : 'UPI / Direct Bank Transfer',
        status: 'Dispensed',
      };

      setCompletedOrder(order);
      onOrderPlaced(order);
      clearCart();
      setIsProcessing(false);
      setCheckoutStep('success');
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/45 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-[#fff8f6] h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-[#f7ddd3] animate-in slide-in-from-right duration-300">
        {/* Cart Top Bar */}
        <div className="p-4 sm:p-5 border-b border-[#ffe9e1] flex items-center justify-between bg-[#fff1ec]/70">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#953c27]" />
            <h2 className="font-headline text-lg sm:text-xl font-medium text-[#261813]">
              Apothecary Basket
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#fde3d9] text-[#953c27] font-semibold">
              {cart.reduce((a, b) => a + b.quantity, 0)} items
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#56423e] hover:bg-[#ffe9e1] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free gift progress bar */}
        <div className="px-5 py-2.5 bg-[#ffe9e1]/70 border-b border-[#f7ddd3]/60 text-xs">
          {rawSubtotal < freeShippingThreshold ? (
            <p className="text-[#904d00] font-medium">
              Add ${(freeShippingThreshold - rawSubtotal).toFixed(2)} more for complimentary shipping &amp; Jasmine Tea!
            </p>
          ) : (
            <p className="text-[#953c27] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#fe932c]" />
              Complimentary expedited apothecary shipping unlocked!
            </p>
          )}
          <div className="w-full bg-[#f7ddd3] h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-[#953c27] h-full transition-all duration-300"
              style={{ width: `${Math.min(100, (rawSubtotal / freeShippingThreshold) * 100)}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#ffe9e1] flex items-center justify-center text-[#953c27]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-headline text-lg text-[#261813]">
                Your basket is empty
              </h3>
              <p className="text-xs text-[#56423e] max-w-xs leading-relaxed">
                Explore our classical cold-pressed elixirs, terracotta hair oils, and herbal rasayanas.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 p-3 rounded-2xl bg-[#fff1ec] border border-[#f7ddd3]/80 shadow-xs"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-xl border border-[#f7ddd3]"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#904d00]">
                        {item.product.compoundNo}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[#89726d] hover:text-[#ba1a1a]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="font-headline text-sm font-medium text-[#261813] line-clamp-1">
                      {item.product.name}
                    </h4>

                    <span className="text-[11px] text-[#56423e]">
                      {item.product.size} {item.isSubscription && '• Monthly Refill'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="font-bold text-sm text-[#261813]">
                      ${(
                        (item.isSubscription ? item.product.subscriptionPrice : item.product.price) *
                        item.quantity
                      ).toFixed(2)}
                    </span>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 bg-white rounded-lg border border-[#dcc0ba] px-2 py-0.5">
                      <button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="text-[#56423e] hover:text-[#261813]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-semibold px-1">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="text-[#56423e] hover:text-[#261813]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Promo Code & Bottom Checkout Action */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#ffe9e1] bg-[#fff8f6] space-y-3">
            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#89726d]" />
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Code (e.g. VEDA15)"
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-[#dcc0ba] text-[#261813] focus:outline-none focus:border-[#953c27]"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-semibold bg-[#ffe9e1] text-[#953c27] rounded-xl hover:bg-[#fde3d9] transition-colors"
              >
                Apply
              </button>
            </form>

            {promoMsg && (
              <p
                className={`text-[11px] font-medium ${
                  promoMsg.success ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {promoMsg.text}
              </p>
            )}

            {/* Price Breakdown */}
            <div className="space-y-1 text-xs text-[#56423e] pt-1">
              <div className="flex justify-between">
                <span>Botanical Subtotal</span>
                <span>${rawSubtotal.toFixed(2)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-[#953c27] font-medium">
                  <span>Ritual Privilege ({appliedDiscount}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Sacred Courier Delivery</span>
                <span>{isFreeShipping ? 'Complimentary' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-[#261813] pt-1 border-t border-[#f7ddd3]">
                <span>Total Amount</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              onClick={() => setIsCheckingOut(true)}
              className="w-full py-3.5 px-4 rounded-xl bg-[#953c27] text-white font-semibold text-sm flex items-center justify-between shadow-md hover:bg-[#b4533c] active:scale-[0.99] transition-all"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#ffdcc3]" />
                <span>Begin Secure Checkout</span>
              </div>
              <div className="flex items-center gap-1">
                <span>${totalAmount.toFixed(2)}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Complete Checkout Modal */}
      {isCheckingOut && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#fff8f6] rounded-3xl border border-[#f7ddd3] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {checkoutStep === 'form' ? (
              <form onSubmit={handlePlaceOrder} className="space-y-5">
                <div className="flex items-center justify-between border-b border-[#ffe9e1] pb-3">
                  <div>
                    <h3 className="font-headline text-xl text-[#261813]">
                      Sacred Dispensation &amp; Shipping
                    </h3>
                    <p className="text-xs text-[#56423e]">
                      VibeVeda Classical Ayurvedic Pharmacy
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="text-[#89726d] hover:text-[#261813]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Recipient Details */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#904d00]">
                    1. Recipient Information
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-[#56423e] block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#dcc0ba] text-[#261813]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#56423e] block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#dcc0ba] text-[#261813]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#56423e] block mb-1">
                      Street Address &amp; Suite *
                    </label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#dcc0ba] text-[#261813]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-[#56423e] block mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#dcc0ba] text-[#261813]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#56423e] block mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#dcc0ba] text-[#261813]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#56423e] block mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#dcc0ba] text-[#261813]"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#904d00]">
                    2. Payment Method
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        paymentMethod === 'card'
                          ? 'border-[#953c27] bg-[#ffe9e1] text-[#953c27]'
                          : 'border-[#dcc0ba] bg-white text-[#56423e]'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 mb-1" />
                      <div className="text-xs font-bold">Credit Card</div>
                      <div className="text-[10px] opacity-75">Stripe 256-bit</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('apple_pay')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        paymentMethod === 'apple_pay'
                          ? 'border-[#953c27] bg-[#ffe9e1] text-[#953c27]'
                          : 'border-[#dcc0ba] bg-white text-[#56423e]'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 mb-1" />
                      <div className="text-xs font-bold">Apple / GPay</div>
                      <div className="text-[10px] opacity-75">1-Touch Pay</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        paymentMethod === 'upi'
                          ? 'border-[#953c27] bg-[#ffe9e1] text-[#953c27]'
                          : 'border-[#dcc0ba] bg-white text-[#56423e]'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 mb-1" />
                      <div className="text-xs font-bold">UPI / Bank</div>
                      <div className="text-[10px] opacity-75">Zero surcharge</div>
                    </button>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="p-3 bg-white rounded-xl border border-[#dcc0ba] space-y-2 text-xs">
                      <div className="flex justify-between items-center text-[#89726d]">
                        <span>Card Number</span>
                        <span className="text-[10px]">VISA • MC • AMEX</span>
                      </div>
                      <input
                        type="text"
                        defaultValue="4242 •••• •••• 4242"
                        className="w-full font-mono text-xs text-[#261813] outline-none"
                      />
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#ffe9e1]">
                        <input
                          type="text"
                          defaultValue="12/28"
                          className="font-mono text-xs text-[#261813] outline-none"
                        />
                        <input
                          type="password"
                          defaultValue="842"
                          className="font-mono text-xs text-[#261813] outline-none text-right"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Order */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#953c27] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-[#b4533c] disabled:opacity-50 transition-all"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Compounding &amp; Authorizing Payment...</span>
                      </>
                    ) : (
                      <>
                        <span>Authorize Payment • ${totalAmount.toFixed(2)}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Success Screen */
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#fde3d9] text-[#953c27] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#904d00]">
                    Order Confirmed &bull; {completedOrder?.id}
                  </span>
                  <h3 className="font-headline text-2xl text-[#261813] mt-1">
                    Your Apothecary Batch is Being Prepared
                  </h3>
                  <p className="text-xs text-[#56423e] mt-1 max-w-sm mx-auto leading-relaxed">
                    A confirmation receipt has been transmitted to {email}. Your formulation will be hand-blended and dispatched via temperature-regulated courier.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#fff1ec] border border-[#f7ddd3] text-left text-xs space-y-2">
                  <div className="flex justify-between font-semibold text-[#261813]">
                    <span>Dispensed To:</span>
                    <span>{fullName}</span>
                  </div>
                  <div className="flex justify-between text-[#56423e]">
                    <span>Shipping Destination:</span>
                    <span>{city}, {country}</span>
                  </div>
                  <div className="flex justify-between text-[#56423e]">
                    <span>Total Debited:</span>
                    <span className="font-bold text-[#953c27]">${completedOrder?.total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsCheckingOut(false);
                    setCheckoutStep('form');
                    onClose();
                  }}
                  className="w-full py-3 rounded-xl bg-[#953c27] text-white font-semibold text-xs shadow hover:bg-[#b4533c] transition-all"
                >
                  Return to VibeVeda Sanctuary
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
