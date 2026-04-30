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
  FaMobileAlt,
  FaShieldAlt,
  FaLock,
  FaTimes,
  FaArrowRight,
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
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'esewa'>('cash');
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
  const [tempOrderNumber, setTempOrderNumber] = useState<string | null>(null);
  const [isNameManuallySet, setIsNameManuallySet] = useState(false);
  const isNameManuallySetRef = useRef(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  
  // Store confirmed order data for success page
  const [confirmedOrder, setConfirmedOrder] = useState<{
    items: CartItem[];
    subtotal: number;
    tax: number;
    serviceCharge: number;
    total: number;
    itemCount: number;
    orderType: string;
    paymentMethod: string;
  } | null>(null);

  // eSewa State
  const [showEsewaModal, setShowEsewaModal] = useState(false);
  const [esewaStep, setEsewaStep] = useState<'login' | 'confirm' | 'processing'>('login');
  const [esewaId, setEsewaId] = useState('');
  const [esewaPassword, setEswaPassword] = useState('');
  const [esewaPin, setEsewaPin] = useState('');
  const [esewaError, setEsewaError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  // FIXED: Cast to Event (not AnimationEvent) to satisfy addEventListener's type signature,
  // then cast internally. Use isNameManuallySetRef so the dep array stays empty — avoids
  // the lint error that appeared on the useEffect line when isNameManuallySet (state) was
  // listed as a dependency.
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
  }, []); // empty deps — safe because we read isNameManuallySetRef (a ref), not state

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

  // Calculate from current cart OR confirmed order
  const getSubtotal = () => confirmedOrder ? confirmedOrder.subtotal : cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const getTax = () => confirmedOrder ? confirmedOrder.tax : Math.round(cart.reduce((sum, item) => sum + item.totalPrice, 0) * 0.13);
  const getServiceCharge = () => confirmedOrder ? confirmedOrder.serviceCharge : (orderType === 'delivery' ? 100 : 0);
  const getGrandTotal = () => confirmedOrder ? confirmedOrder.total : getSubtotal() + getTax() + getServiceCharge();
  const getItemCount = () => confirmedOrder ? confirmedOrder.itemCount : cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Get items to display (confirmed order items or current cart)
  const getDisplayItems = () => confirmedOrder ? confirmedOrder.items : cart;
  const getDisplayOrderType = () => confirmedOrder ? confirmedOrder.orderType : orderType;
  const getDisplayPaymentMethod = () => confirmedOrder ? confirmedOrder.paymentMethod : paymentMethod;

  // FIXED: Name change handler — marks name as manually set (both state and ref) so the
  // animationstart listener will never overwrite it again after the user starts typing.
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setCustomerInfo(prev => ({ ...prev, name: newName }));
    setIsNameManuallySet(true);
    isNameManuallySetRef.current = true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // FIXED: When phone/email autofill fires, preserve the manually typed name in state.
    // Previously the interval would re-read the DOM name input and overwrite state anyway;
    // now that the interval is gone, this guard is sufficient.
    if ((name === 'phone' || name === 'email') && isNameManuallySet && customerInfo.name) {
      const currentName = customerInfo.name;
      setCustomerInfo(prev => ({ ...prev, [name]: value, name: currentName }));
    } else {
      setCustomerInfo(prev => ({ ...prev, [name]: value }));
    }
  };

  // Save order details before clearing cart
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
      orderType,
      paymentMethod
    });
  };

  // eSewa Login Handler
  const handleEsewaLogin = async () => {
    if (!esewaId || !esewaPassword) {
      setEsewaError('Please enter your eSewa ID and password');
      return;
    }

    setIsLoading(true);
    setEsewaError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setEsewaStep('confirm');
    } catch (error) {
      setEsewaError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // eSewa Payment Handler
  const handleEsewaPayment = async () => {
    if (!esewaPin || esewaPin.length < 4) {
      setEsewaError('Please enter your 4-digit eSewa PIN');
      return;
    }

    if (!tempOrderNumber) {
      setEsewaError('Order not found. Please try again.');
      return;
    }

    setIsLoading(true);
    setEsewaStep('processing');
    setEsewaError('');

    try {
      const paymentResponse = await fetch('http://localhost:5000/api/payment/process-esewa-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: getGrandTotal(),
          orderNumber: tempOrderNumber,
          esewaToken: `ESW-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        })
      });

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok || !paymentData.success) {
        await fetch(`http://localhost:5000/api/orders/${tempOrderNumber}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentStatus: 'FAILED' })
        });
        
        throw new Error(paymentData.error || 'Payment failed');
      }

      await fetch(`http://localhost:5000/api/orders/${tempOrderNumber}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: 'COMPLETED' })
      });

      // Save order details BEFORE clearing cart
      saveOrderConfirmation();
      
      setShowEsewaModal(false);
      setOrderNumber(tempOrderNumber);
      setOrderPlaced(true);
      localStorage.removeItem('kingsCart');
      setCart([]);
      
    } catch (paymentError) {
      setEsewaError(paymentError instanceof Error ? paymentError.message : 'Payment failed. Please try again.');
      setEsewaStep('confirm');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceOrder = () => {
    // FIXED: Read directly from React state (customerInfo.name) — the manually typed value.
    // Previously this re-read from nameInputRef.current.value which could contain the
    // browser-autofilled DOM value even when React state had the correct typed name.
    if (paymentMethod === 'esewa') {
      placeOrderWithEsewa();
    } else {
      placeOrderCash();
    }
  };

  const placeOrderCash = async () => {
    setIsSubmitting(true);
    
    // FIXED: Always use customerInfo.name from React state — never re-read from the DOM ref.
    // The DOM ref could hold a browser-autofilled value that was never reflected in state.
    const finalName = customerInfo.name;
    
    try {
      const orderData = {
        customer: {
          name: finalName,
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
        paymentMethod: 'cash',
        paymentStatus: 'PENDING',
        subtotal: getSubtotal(),
        tax: getTax(),
        serviceCharge: getServiceCharge(),
        totalAmount: getGrandTotal(),
        specialInstructions: customerInfo.specialInstructions || null
      };

      console.log('📦 Submitting order with name:', finalName);

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
      
      // Save order details BEFORE clearing cart
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

  const placeOrderWithEsewa = async () => {
    setIsSubmitting(true);
    
    // FIXED: Always use customerInfo.name from React state — never re-read from the DOM ref.
    const finalName = customerInfo.name;
    
    try {
      const orderData = {
        customer: {
          name: finalName,
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
        paymentMethod: 'esewa',
        paymentStatus: 'PENDING',
        subtotal: getSubtotal(),
        tax: getTax(),
        serviceCharge: getServiceCharge(),
        totalAmount: getGrandTotal(),
        specialInstructions: customerInfo.specialInstructions || null
      };

      console.log('📦 Submitting order with name:', finalName);

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
      setTempOrderNumber(orderResult.orderNumber);
      
      setShowEsewaModal(true);
      setEsewaStep('login');
      setEsewaId('');
      setEswaPassword('');
      setEsewaPin('');
      setEsewaError('');
      
    } catch (error) {
      console.error('Order error:', error);
      alert(error instanceof Error ? error.message : 'Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeEsewaModal = () => {
    setShowEsewaModal(false);
    setTempOrderNumber(null);
  };

  // Success page
  if (orderPlaced) {
    const displayItems = getDisplayItems();
    const displayOrderType = getDisplayOrderType();
    const displayPaymentMethod = getDisplayPaymentMethod();
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
            
            {/* Order Number */}
            <div className={styles.orderNumberBox}>
              <span className={styles.orderNumberLabel}>Order Number</span>
              <strong className={styles.orderNumberValue}>{orderNumber}</strong>
            </div>

            {/* Order Summary Section */}
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
                  <span className={styles.summaryValue}>
                    {displayPaymentMethod === 'esewa' ? (
                      <span className={styles.esewaBadge}>
                        <FaMobileAlt /> eSewa
                      </span>
                    ) : 'Cash'}
                  </span>
                </div>
              </div>

              {/* Ordered Items List */}
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

              {/* Price Breakdown */}
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

              {displayPaymentMethod === 'esewa' && (
                <div className={styles.paymentSuccessBadge}>
                  <FaCheckCircle />
                  <span>eSewa Payment Successful</span>
                </div>
              )}
            </div>

            {/* Customer Info */}
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

  // Main checkout page
  return (
    <>
      <div className={styles.container}>
        {/* Navigation */}
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
            {/* Left Column - Order Summary */}
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

            {/* Right Column - Customer Details */}
            <div className={styles.customerDetails}>
              {/* Order Type */}
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

              {/* Customer Information */}
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
                      autoComplete="tel"
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
                      autoComplete="email"
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

              {/* Payment Method */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <FaMoneyBillWave /> Payment Method
                </h2>
                <div className={styles.paymentGrid}>
                  <button
                    className={`${styles.paymentBtn} ${paymentMethod === 'cash' ? styles.active : ''}`}
                    onClick={() => setPaymentMethod('cash')}
                  >
                    <FaMoneyBillWave />
                    <span>Cash</span>
                  </button>
                  <button
                    className={`${styles.paymentBtn} ${paymentMethod === 'esewa' ? styles.active : ''}`}
                    onClick={() => setPaymentMethod('esewa')}
                  >
                    <FaMobileAlt />
                    <span>eSewa</span>
                  </button>
                </div>

                {paymentMethod === 'esewa' && (
                  <div className={styles.esewaInfo}>
                    <div className={styles.esewaHeader}>
                      <FaMobileAlt className={styles.esewaIcon} />
                      <span>Pay with eSewa</span>
                    </div>
                    <div className={styles.esewaDetails}>
                      <div className={styles.esewaDetailRow}>
                        <span>Amount:</span>
                        <strong>Rs. {getGrandTotal()}</strong>
                      </div>
                      <div className={styles.esewaNote}>
                        <FaShieldAlt />
                        <span>You'll be redirected to eSewa secure payment after placing order</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Place Order Button */}
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
                ) : paymentMethod === 'esewa' ? (
                  <><FaMobileAlt /> Pay with eSewa • Rs. {getGrandTotal()}</>
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

      {/* ESEWA PAYMENT MODAL */}
      {showEsewaModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.esewaModal}>
            <div className={styles.esewaModalHeader}>
              <FaMobileAlt className={styles.esewaModalIcon} />
              <h2>
                {esewaStep === 'login' && 'eSewa Login'}
                {esewaStep === 'confirm' && 'Confirm Payment'}
                {esewaStep === 'processing' && 'Processing...'}
              </h2>
              <button className={styles.closeModalBtn} onClick={closeEsewaModal}>
                <FaTimes />
              </button>
            </div>

            <div className={styles.esewaModalBody}>
              {esewaStep === 'login' && (
                <div className={styles.esewaFormSection}>
                  <div className={styles.formGroupFull}>
                    <label>eSewa ID / Mobile Number</label>
                    <input
                      type="text"
                      value={esewaId}
                      onChange={(e) => {
                        setEsewaId(e.target.value);
                        setEsewaError('');
                      }}
                      placeholder="98XXXXXXXX or username"
                      className={styles.esewaInput}
                    />
                  </div>

                  <div className={styles.formGroupFull}>
                    <label>Password</label>
                    <input
                      type="password"
                      value={esewaPassword}
                      onChange={(e) => {
                        setEswaPassword(e.target.value);
                        setEsewaError('');
                      }}
                      placeholder="Enter your password"
                      className={styles.esewaInput}
                    />
                  </div>

                  {esewaError && (
                    <div className={styles.errorBox}>
                      <span>{esewaError}</span>
                    </div>
                  )}

                  <button 
                    className={styles.esewaActionBtn}
                    onClick={handleEsewaLogin}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <><FaSpinner className={styles.spinner} /> Logging in...</>
                    ) : (
                      <>Login to eSewa <FaArrowRight /></>
                    )}
                  </button>
                </div>
              )}

              {esewaStep === 'confirm' && (
                <div className={styles.esewaFormSection}>
                  <div className={styles.orderAmountDisplay}>
                    <span>Amount to Pay</span>
                    <h3>Rs. {getGrandTotal()}</h3>
                  </div>

                  <div className={styles.orderRefDisplay}>
                    <span>Order Number</span>
                    <strong>{tempOrderNumber}</strong>
                  </div>

                  <div className={styles.formGroupFull}>
                    <label><FaLock /> Enter eSewa PIN</label>
                    <input
                      type="password"
                      value={esewaPin}
                      onChange={(e) => {
                        setEsewaPin(e.target.value.slice(0, 4));
                        setEsewaError('');
                      }}
                      placeholder="Enter 4-digit PIN"
                      maxLength={4}
                      className={styles.esewaInput}
                    />
                  </div>

                  {esewaError && (
                    <div className={styles.errorBox}>
                      <span>{esewaError}</span>
                    </div>
                  )}

                  <button 
                    className={styles.esewaActionBtn}
                    onClick={handleEsewaPayment}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <><FaSpinner className={styles.spinner} /> Processing...</>
                    ) : (
                      <>Pay Rs. {getGrandTotal()} <FaArrowRight /></>
                    )}
                  </button>
                </div>
              )}

              {esewaStep === 'processing' && (
                <div className={styles.processingSection}>
                  <FaSpinner className={styles.spinnerLarge} />
                  <h3>Processing Payment</h3>
                  <p>Please wait while we process your eSewa payment...</p>
                  <span className={styles.processingAmount}>Rs. {getGrandTotal()}</span>
                </div>
              )}

              <div className={styles.secureNote}>
                <FaShieldAlt />
                <span>Secured by eSewa • 256-bit SSL Encryption</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}