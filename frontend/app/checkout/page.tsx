'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './checkout.module.css';
import Link from 'next/link';
import { 
  FaCrown,
  FaChevronLeft,
  FaShoppingBag,
  FaLeaf,
  FaTrash,
  FaPlus,
  FaMinus,
  FaMoneyBillWave,
  FaCheckCircle,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaSpinner,
  FaReceipt
} from 'react-icons/fa';

type CartItem = {
  id: string;
  name: string;
  basePrice: number;
  addOns: { name: string; price: number }[];
  quantity: number;
  totalPrice: number;
  isVegan?: boolean;
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway' | 'delivery'>('dine-in');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    specialInstructions: ''
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNameManuallySet, setIsNameManuallySet] = useState(false);
  const isNameManuallySetRef = useRef(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  
  const [confirmedOrder, setConfirmedOrder] = useState<{
    items: CartItem[];
    subtotal: number;
    tax: number;
    serviceCharge: number;
    total: number;
    itemCount: number;
    orderType: string;
  } | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem('kingsCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Error parsing cart:', error);
        setCart([]);
      }
    }
  }, []);

  useEffect(() => {
    const handleAnimationStart = (e: Event) => {
      const animName = (e as AnimationEvent).animationName;
      if (animName === 'onAutoFillStart') {
        if (!isNameManuallySetRef.current && nameInputRef.current) {
          const autofillValue = nameInputRef.current.value;
          if (autofillValue) {
            setCustomerInfo(prev => ({ ...prev, name: autofillValue }));
          }
        }
      }
    };

    document.addEventListener('animationstart', handleAnimationStart);
    return () => {
      document.removeEventListener('animationstart', handleAnimationStart);
    };
  }, []);

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const newCart = prev.filter(item => item.id !== id);
      localStorage.setItem('kingsCart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart(prev => {
      const newCart = prev.map(item => {
        if (item.id === id) {
          const addOnsTotal = item.addOns.reduce((sum, addOn) => sum + addOn.price, 0);
          const newTotalPrice = (item.basePrice + addOnsTotal) * newQuantity;
          return { ...item, quantity: newQuantity, totalPrice: newTotalPrice };
        }
        return item;
      });
      localStorage.setItem('kingsCart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const getSubtotal = () => confirmedOrder ? confirmedOrder.subtotal : cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const getTax = () => confirmedOrder ? confirmedOrder.tax : Math.round(cart.reduce((sum, item) => sum + item.totalPrice, 0) * 0.13);
  const getServiceCharge = () => confirmedOrder ? confirmedOrder.serviceCharge : (orderType === 'delivery' ? 100 : 0);
  const getGrandTotal = () => confirmedOrder ? confirmedOrder.total : getSubtotal() + getTax() + getServiceCharge();
  const getItemCount = () => confirmedOrder ? confirmedOrder.itemCount : cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const getDisplayItems = () => confirmedOrder ? confirmedOrder.items : cart;
  const getDisplayOrderType = () => confirmedOrder ? confirmedOrder.orderType : orderType;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setCustomerInfo(prev => ({ ...prev, name: newName }));
    setIsNameManuallySet(true);
    isNameManuallySetRef.current = true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if ((name === 'phone' || name === 'email') && isNameManuallySet && customerInfo.name) {
      const currentName = customerInfo.name;
      setCustomerInfo(prev => ({ ...prev, [name]: value, name: currentName }));
    } else {
      setCustomerInfo(prev => ({ ...prev, [name]: value }));
    }
  };

  const saveOrderConfirmation = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = Math.round(subtotal * 0.13);
    const serviceCharge = orderType === 'delivery' ? 100 : 0;
    const total = subtotal + tax + serviceCharge;
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    setConfirmedOrder({
      items: [...cart],
      subtotal,
      tax,
      serviceCharge,
      total,
      itemCount,
      orderType
    });
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    
    try {
      const orderData = {
        customer: {
          name: customerInfo.name,
          phone: customerInfo.phone,
          email: customerInfo.email || null,
          address: orderType === 'delivery' ? customerInfo.address : null
        },
        items: cart.map(item => ({
          name: item.name,
          basePrice: item.basePrice,
          quantity: item.quantity,
          isVegan: item.isVegan || false,
          totalPrice: item.totalPrice,
          addOns: item.addOns.map(addOn => ({
            name: addOn.name,
            price: addOn.price
          }))
        })),
        orderType,
        subtotal: getSubtotal(),
        tax: getTax(),
        serviceCharge: getServiceCharge(),
        totalAmount: getGrandTotal(),
        specialInstructions: customerInfo.specialInstructions || null
      };

      const orderResponse = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const orderResult = await orderResponse.json();
      
      saveOrderConfirmation();
      
      setOrderNumber(orderResult.orderNumber);
      setOrderPlaced(true);
      localStorage.removeItem('kingsCart');
      setCart([]);
      
    } catch (error) {
      console.error('Order error:', error);
      alert(error instanceof Error ? error.message : 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderPlaced) {
    const displayItems = getDisplayItems();
    const displayOrderType = getDisplayOrderType();
    const itemCount = getItemCount();
    const subtotal = getSubtotal();
    const tax = getTax();
    const serviceCharge = getServiceCharge();
    const grandTotal = getGrandTotal();

    return (
      <div className={styles.container}>
        <nav className={styles.nav}>
          <div className={styles.navContainer}>
            <Link href="/" className={styles.logo}>
              <FaCrown className={styles.logoIcon} />
              <div>
                <span className={styles.logoText}>KINGS</span>
                <span className={styles.logoSubtext}>EATERY</span>
              </div>
            </Link>
          </div>
        </nav>

        <div className={styles.successContainer}>
          <div className={styles.successCard}>
            <div className={styles.successIconWrapper}>
              <FaCheckCircle className={styles.successIcon} />
            </div>
            
            <h1 className={styles.successTitle}>Order Confirmed!</h1>
            <p className={styles.successSubtitle}>Thank you for your order. Your food is being prepared with love!</p>
            
            <div className={styles.orderNumberBox}>
              <span className={styles.orderNumberLabel}>Order Number</span>
              <strong className={styles.orderNumberValue}>{orderNumber}</strong>
            </div>

            <div className={styles.orderSummaryBox}>
              <h3 className={styles.orderSummaryTitle}>
                <FaReceipt className={styles.receiptIcon} />
                Order Summary
              </h3>
              
              <div className={styles.orderSummaryItems}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Total Items</span>
                  <span className={styles.summaryValue}>{itemCount} items</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Order Type</span>
                  <span className={styles.summaryValue}>{displayOrderType.charAt(0).toUpperCase() + displayOrderType.slice(1)}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Payment Method</span>
                  <span className={styles.summaryValue}>Cash</span>
                </div>
              </div>

              <div className={styles.orderedItemsList}>
                <h4 className={styles.itemsListTitle}>Your Order</h4>
                {displayItems.length > 0 ? (
                  displayItems.map((item, index) => (
                    <div key={item.id || index} className={styles.orderedItemRow}>
                      <div className={styles.orderedItemInfo}>
                        <span className={styles.orderedItemName}>
                          {item.isVegan && <FaLeaf className={styles.veganIconSmall} />}
                          {item.name}
                        </span>
                        {item.addOns && item.addOns.length > 0 && (
                          <span className={styles.orderedItemAddOns}>
                            {item.addOns.map(a => `+ ${a.name}`).join(', ')}
                          </span>
                        )}
                      </div>
                      <div className={styles.orderedItemRight}>
                        <span className={styles.orderedItemQty}>x{item.quantity}</span>
                        <span className={styles.orderedItemPrice}>Rs. {item.totalPrice}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={styles.noItemsText}>No items found</p>
                )}
              </div>

              <div className={styles.summaryDivider}></div>

              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Subtotal</span>
                <span className={styles.summaryValue}>Rs. {subtotal}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Tax (13%)</span>
                <span className={styles.summaryValue}>Rs. {tax}</span>
              </div>
              {displayOrderType === 'delivery' && serviceCharge > 0 && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Delivery Charge</span>
                  <span className={styles.summaryValue}>Rs. {serviceCharge}</span>
                </div>
              )}
              
              <div className={styles.summaryTotalRow}>
                <span className={styles.summaryTotalLabel}>Total Amount</span>
                <span className={styles.summaryTotalValue}>Rs. {grandTotal}</span>
              </div>
            </div>

            <div className={styles.customerInfoBox}>
              <div className={styles.customerInfoItem}>
                <FaUser className={styles.customerInfoIcon} />
                <span>{customerInfo.name}</span>
              </div>
              <div className={styles.customerInfoItem}>
                <FaPhone className={styles.customerInfoIcon} />
                <span>{customerInfo.phone}</span>
              </div>
              {displayOrderType === 'delivery' && customerInfo.address && (
                <div className={styles.customerInfoItem}>
                  <FaMapMarkerAlt className={styles.customerInfoIcon} />
                  <span>{customerInfo.address}</span>
                </div>
              )}
            </div>

            <div className={styles.successActions}>
              <Link href="/menu" className={styles.continueOrderingBtn}>
                <FaShoppingBag /> Order More
              </Link>
              <Link href="/" className={styles.homeBtn}>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <Link href="/menu" className={styles.backBtn}>
            <FaChevronLeft /> Back to Menu
          </Link>
          <div className={styles.logo}>
            <FaCrown className={styles.logoIcon} />
            <div>
              <span className={styles.logoText}>KINGS</span>
              <span className={styles.logoSubtext}>EATERY</span>
            </div>
          </div>
          <div className={styles.navSpacer}></div>
        </div>
      </nav>

      <div className={styles.checkoutContainer}>
        <div className={styles.checkoutGrid}>
          <div className={styles.orderSummary}>
            <h2 className={styles.sectionTitle}>
              <FaShoppingBag /> Order Summary ({getItemCount()} items)
            </h2>

            <div className={styles.cartItems}>
              {cart.length === 0 ? (
                <div className={styles.emptyCart}>
                  <p>Your cart is empty</p>
                  <Link href="/menu" className={styles.browseMenuBtn}>Browse Menu</Link>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.cartItemInfo}>
                      <h4>
                        {item.isVegan && <FaLeaf className={styles.veganIcon} />}
                        {item.name}
                      </h4>
                      {item.addOns.length > 0 && (
                        <div className={styles.addOnsList}>
                          {item.addOns.map(addOn => (
                            <span key={addOn.name}>+ {addOn.name} (Rs. {addOn.price})</span>
                          ))}
                        </div>
                      )}
                      <div className={styles.itemPriceRow}>
                        <span>Rs. {item.basePrice} x {item.quantity}</span>
                        <strong>Rs. {item.totalPrice}</strong>
                      </div>
                    </div>
                    <div className={styles.cartItemControls}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className={styles.qtyBtn}>
                        <FaMinus />
                      </button>
                      <span className={styles.qty}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className={styles.qtyBtn}>
                        <FaPlus />
                      </button>
                      <button onClick={() => removeFromCart(item.id)} className={styles.removeBtn}>
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className={styles.priceBreakdown}>
              <div className={styles.priceRow}>
                <span>Subtotal</span>
                <span>Rs. {getSubtotal()}</span>
              </div>
              <div className={styles.priceRow}>
                <span>Tax (13%)</span>
                <span>Rs. {getTax()}</span>
              </div>
              {orderType === 'delivery' && (
                <div className={styles.priceRow}>
                  <span>Delivery Charge</span>
                  <span>Rs. {getServiceCharge()}</span>
                </div>
              )}
              <div className={styles.totalRow}>
                <span>Grand Total</span>
                <strong>Rs. {getGrandTotal()}</strong>
              </div>
            </div>
          </div>

          <div className={styles.customerDetails}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Order Type</h2>
              <div className={styles.orderTypeGrid}>
                <button
                  className={`${styles.orderTypeBtn} ${orderType === 'dine-in' ? styles.active : ''}`}
                  onClick={() => setOrderType('dine-in')}
                >
                  <FaShoppingBag />
                  <span>Dine In</span>
                </button>
                <button
                  className={`${styles.orderTypeBtn} ${orderType === 'takeaway' ? styles.active : ''}`}
                  onClick={() => setOrderType('takeaway')}
                >
                  <FaShoppingBag />
                  <span>Takeaway</span>
                </button>
                <button
                  className={`${styles.orderTypeBtn} ${orderType === 'delivery' ? styles.active : ''}`}
                  onClick={() => setOrderType('delivery')}
                >
                  <FaShoppingBag />
                  <span>Delivery</span>
                </button>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <FaUser /> Your Information
              </h2>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label><FaUser /> Full Name *</label>
                  <input
                    ref={nameInputRef}
                    type="text"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleNameChange}
                    placeholder="Enter your full name"
                    required
                    autoComplete="off"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label><FaPhone /> Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    placeholder="98XXXXXXXX"
                    required
                    autoComplete="off"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label><FaEnvelope /> Email (optional)</label>
                  <input
                    type="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    autoComplete="off"
                  />
                </div>
                {orderType === 'delivery' && (
                  <div className={styles.formGroupFull}>
                    <label><FaMapMarkerAlt /> Delivery Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={customerInfo.address}
                      onChange={handleInputChange}
                      placeholder="Enter your full address"
                      required={orderType === 'delivery'}
                      autoComplete="off"
                    />
                  </div>
                )}
                <div className={styles.formGroupFull}>
                  <label>Special Instructions</label>
                  <textarea
                    name="specialInstructions"
                    value={customerInfo.specialInstructions}
                    onChange={handleInputChange}
                    placeholder="Any allergies or special requests?"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <FaMoneyBillWave /> Payment Method
              </h2>
              <div className={styles.cashPaymentInfo}>
                <FaMoneyBillWave className={styles.cashPaymentIcon} />
                <div className={styles.cashPaymentText}>
                  <h4>Cash on Delivery/Pickup</h4>
                  <p>Pay with cash when you receive your order</p>
                </div>
              </div>
            </div>

            <button 
              className={styles.placeOrderBtn}
              onClick={handlePlaceOrder}
              disabled={
                cart.length === 0 || 
                !customerInfo.name || 
                !customerInfo.phone || 
                isSubmitting ||
                (orderType === 'delivery' && !customerInfo.address)
              }
            >
              {isSubmitting ? (
                <><FaSpinner className={styles.spinner} /> Placing Order...</>
              ) : (
                <><FaCheckCircle /> Place Order • Rs. {getGrandTotal()}</>
              )}
            </button>
            
            {(!customerInfo.name || !customerInfo.phone) && (
              <p className={styles.requiredNote}>* Please fill in required fields to place order</p>
            )}
            {(orderType === 'delivery' && !customerInfo.address) && (
              <p className={styles.requiredNote}>* Delivery address is required for delivery orders</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}