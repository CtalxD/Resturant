'use client';

import { useState, useEffect } from 'react';
import styles from './styles/staff-panel.module.css';
import { 
  FaCrown,
  FaShoppingBag,
  FaClipboardList,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSpinner,
  FaSearch,
  FaBox,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaLeaf,
  FaMobileAlt,
  FaUtensils,
  FaExclamationCircle,
  FaRedo,
  FaEye,
  FaTimes,
  FaFilter,
  FaSort,
  FaChevronDown,
  FaChevronUp,
  FaReceipt,
  FaBan,
  FaUndo
} from 'react-icons/fa';

type OrderItem = {
  id: number;
  itemName: string;
  basePrice: number;
  quantity: number;
  totalPrice: number;
  isVegan: boolean;
  addOns: {
    name: string;
    price: number;
  }[];
};

type Payment = {
  id: number;
  paymentReference: string;
  paymentGateway: string;
  transactionId?: string;
  amount: number;
  status: string;
  createdAt: string;
};

type Order = {
  id: number;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
  };
  items: OrderItem[];
  payments: Payment[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  totalAmount: number;
  status: string;
  orderType: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentReference?: string;
  specialInstructions?: string;
  createdAt: string;
};

export default function StaffPanelPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    preparing: 0,
    ready: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0,
    esewaPayments: 0,
    cashPayments: 0,
    pendingCashPayments: 0,
    paidCashPayments: 0
  });

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterAndSortOrders();
    calculateStats();
  }, [orders, searchTerm, statusFilter, paymentFilter, orderTypeFilter, sortOrder]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data.orders || []);
      setError('');
    } catch (err) {
      setError('Failed to load orders. Please check if the backend is running.');
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = () => {
    const allOrders = orders;
    const completedOrders = allOrders.filter(o => o.paymentStatus === 'COMPLETED');
    const cashOrders = allOrders.filter(o => o.paymentMethod === 'cash');
    const esewaOrders = allOrders.filter(o => o.paymentMethod === 'esewa');
    
    setStats({
      total: allOrders.length,
      pending: allOrders.filter(o => o.status === 'pending').length,
      preparing: allOrders.filter(o => o.status === 'preparing').length,
      ready: allOrders.filter(o => o.status === 'ready').length,
      completed: allOrders.filter(o => o.status === 'completed').length,
      cancelled: allOrders.filter(o => o.status === 'cancelled').length,
      totalRevenue: completedOrders.reduce((sum, o) => sum + o.totalAmount, 0),
      esewaPayments: esewaOrders.filter(o => o.paymentStatus === 'COMPLETED').length,
      cashPayments: cashOrders.length,
      pendingCashPayments: cashOrders.filter(o => o.paymentStatus !== 'COMPLETED').length,
      paidCashPayments: cashOrders.filter(o => o.paymentStatus === 'COMPLETED').length
    });
  };

  const filterAndSortOrders = () => {
    let filtered = [...orders];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(term) ||
        order.customer.name.toLowerCase().includes(term) ||
        order.customer.phone.includes(term)
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(order => order.paymentStatus === paymentFilter);
    }
    
    if (orderTypeFilter !== 'all') {
      filtered = filtered.filter(order => order.orderType === orderTypeFilter);
    }
    
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    
    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderNumber: string, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderNumber}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) throw new Error('Failed to update order');
      fetchOrders();
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Failed to update order status');
    }
  };

  const updatePaymentStatus = async (orderNumber: string, paymentStatus: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderNumber}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus })
      });
      
      if (!response.ok) throw new Error('Failed to update payment status');
      fetchOrders();
    } catch (err) {
      console.error('Error updating payment:', err);
      alert('Failed to update payment status');
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return styles.statusPending;
      case 'preparing': return styles.statusPreparing;
      case 'ready': return styles.statusReady;
      case 'completed': return styles.statusCompleted;
      case 'cancelled': return styles.statusCancelled;
      default: return styles.statusPending;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch(status) {
      case 'COMPLETED': return styles.paymentCompleted;
      case 'PENDING': return styles.paymentPending;
      case 'FAILED': return styles.paymentFailed;
      case 'REFUNDED': return styles.paymentRefunded;
      case 'CANCELLED': return styles.paymentCancelled;
      default: return styles.paymentPending;
    }
  };

  const getOrderTypeIcon = (type: string) => {
    switch(type) {
      case 'dine-in': return '🪑';
      case 'takeaway': return '🛍️';
      case 'delivery': return '🚗';
      default: return '📋';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const orderDate = new Date(dateString);
    const diffMs = now.getTime() - orderDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 120) return '1h ago';
    
    return orderDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const viewOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const closeOrderDetail = () => {
    setShowOrderDetail(false);
    setSelectedOrder(null);
  };

  const getNextStatus = (currentStatus: string) => {
    switch(currentStatus) {
      case 'pending': return 'preparing';
      case 'preparing': return 'ready';
      case 'ready': return 'completed';
      default: return null;
    }
  };

  const getNextStatusLabel = (currentStatus: string) => {
    switch(currentStatus) {
      case 'pending': return 'Start Preparing';
      case 'preparing': return 'Mark as Ready';
      case 'ready': return 'Complete';
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': return <><FaClock /> Pending</>;
      case 'preparing': return <><FaSpinner className={styles.spinIcon} /> Preparing</>;
      case 'ready': return <><FaCheckCircle /> Ready</>;
      case 'completed': return <><FaCheckCircle /> Done</>;
      case 'cancelled': return <><FaBan /> Cancelled</>;
      default: return <><FaClock /> {status}</>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch(status) {
      case 'COMPLETED': return <><FaCheckCircle /> Paid</>;
      case 'PENDING': return <><FaClock /> Unpaid</>;
      case 'FAILED': return <><FaTimesCircle /> Failed</>;
      case 'REFUNDED': return <><FaUndo /> Refunded</>;
      case 'CANCELLED': return <><FaBan /> Cancelled</>;
      default: return <><FaClock /> {status}</>;
    }
  };

  const canMarkAsPaid = (order: Order) => {
    return order.paymentMethod === 'cash' && order.paymentStatus === 'PENDING';
  };

  const canUndoPayment = (order: Order) => {
    return false; // Never allow undoing payment
  };

  return (
    <div className={styles.container}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <div className={styles.logo}>
            <FaCrown className={styles.logoIcon} />
            <div>
              <span className={styles.logoText}>QUEENS</span>
              <span className={styles.logoSubtext}>EATERY</span>
            </div>
          </div>
          <div className={styles.navRight}>
            <span className={styles.staffLabel}>Staff Panel</span>
            <button 
              className={styles.refreshBtn}
              onClick={fetchOrders}
              disabled={isLoading}
            >
              <FaRedo className={isLoading ? styles.spinIcon : ''} /> Refresh
            </button>
          </div>
        </div>
      </nav>

      <div className={styles.mainContent}>
        {/* Stats Dashboard */}
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.statPending}`}>
            <div className={styles.statIcon}><FaClock /></div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.pending}</span>
              <span className={styles.statLabel}>Pending</span>
            </div>
          </div>
          <div className={`${styles.statCard} ${styles.statPreparing}`}>
            <div className={styles.statIcon}><FaUtensils /></div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.preparing}</span>
              <span className={styles.statLabel}>Preparing</span>
            </div>
          </div>
          <div className={`${styles.statCard} ${styles.statReady}`}>
            <div className={styles.statIcon}><FaCheckCircle /></div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.ready}</span>
              <span className={styles.statLabel}>Ready</span>
            </div>
          </div>
          <div className={`${styles.statCard} ${styles.statCompleted}`}>
            <div className={styles.statIcon}><FaShoppingBag /></div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.completed}</span>
              <span className={styles.statLabel}>Completed</span>
            </div>
          </div>
          <div className={`${styles.statCard} ${styles.statCash}`}>
            <div className={styles.statIcon}><FaMoneyBillWave /></div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>
                <span className={styles.statPaid}>{stats.paidCashPayments}</span>
                <span className={styles.statSep}>/</span>
                <span className={styles.statUnpaid}>{stats.pendingCashPayments}</span>
              </span>
              <span className={styles.statLabel}>Cash (Paid/Unpaid)</span>
            </div>
          </div>
          <div className={`${styles.statCard} ${styles.statEsewa}`}>
            <div className={styles.statIcon}><FaMobileAlt /></div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.esewaPayments}</span>
              <span className={styles.statLabel}>eSewa Paid</span>
            </div>
          </div>
          <div className={`${styles.statCard} ${styles.statRevenue}`}>
            <div className={styles.statIcon}><FaReceipt /></div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>Rs. {stats.totalRevenue.toLocaleString()}</span>
              <span className={styles.statLabel}>Revenue (Paid)</span>
            </div>
          </div>
          <div className={`${styles.statCard} ${styles.statCancelled}`}>
            <div className={styles.statIcon}><FaBan /></div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.cancelled}</span>
              <span className={styles.statLabel}>Cancelled</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>
              <FaClipboardList /> Orders
            </h1>
            <span className={styles.orderCount}>
              {filteredOrders.length} of {orders.length} orders
            </span>
          </div>
          <div className={styles.headerRight}>
            <button 
              className={styles.filterToggleBtn}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter /> Filters {showFilters ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            <button 
              className={styles.sortBtn}
              onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
            >
              <FaSort /> {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className={styles.filtersPanel}>
            <div className={styles.searchBox}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search by order number, customer name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <div className={styles.filterGroups}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Order Status</label>
                <div className={styles.statusFilters}>
                  {['all', 'pending', 'preparing', 'ready', 'completed', 'cancelled'].map(status => (
                    <button
                      key={status}
                      className={`${styles.filterBtn} ${statusFilter === status ? styles.filterActive : ''}`}
                      onClick={() => setStatusFilter(status)}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Payment Status</label>
                <div className={styles.statusFilters}>
                  {['all', 'PENDING', 'COMPLETED', 'FAILED'].map(status => (
                    <button
                      key={status}
                      className={`${styles.filterBtn} ${paymentFilter === status ? styles.filterActive : ''}`}
                      onClick={() => setPaymentFilter(status)}
                    >
                      {status === 'all' ? 'All' : status === 'PENDING' ? 'Unpaid' : status === 'COMPLETED' ? 'Paid' : status.charAt(0) + status.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Order Type</label>
                <div className={styles.statusFilters}>
                  {['all', 'dine-in', 'takeaway', 'delivery'].map(type => (
                    <button
                      key={type}
                      className={`${styles.filterBtn} ${orderTypeFilter === type ? styles.filterActive : ''}`}
                      onClick={() => setOrderTypeFilter(type)}
                    >
                      {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders List */}
        {isLoading ? (
          <div className={styles.stateContainer}>
            <FaSpinner className={styles.spinIcon} />
            <p>Loading orders...</p>
          </div>
        ) : error ? (
          <div className={styles.stateContainer}>
            <FaExclamationCircle className={styles.stateIcon} />
            <p>{error}</p>
            <button onClick={fetchOrders} className={styles.retryBtn}>Try Again</button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className={styles.stateContainer}>
            <FaBox className={styles.stateIcon} />
            <p>No orders found</p>
            <span>Orders will appear here when customers place them</span>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {filteredOrders.map((order) => (
              <div key={order.id} className={`${styles.orderCard} ${order.status === 'pending' ? styles.orderCardNew : ''}`}>
                <div className={styles.orderCardHeader}>
                  <div className={styles.orderInfo}>
                    <span className={styles.orderNumber}>#{order.orderNumber}</span>
                    <span className={`${styles.orderStatus} ${getStatusColor(order.status)}`}>
                      {getStatusBadge(order.status)}
                    </span>
                    <span className={styles.orderTypeBadge}>
                      {getOrderTypeIcon(order.orderType)} {order.orderType}
                    </span>
                  </div>
                  <div className={styles.orderHeaderRight}>
                    <span className={`${styles.paymentMiniBadge} ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus === 'COMPLETED' ? 'PAID' : 'UNPAID'}
                    </span>
                    <span className={styles.orderTime}>{formatTime(order.createdAt)}</span>
                  </div>
                </div>

                <div className={styles.orderCardBody}>
                  <div className={styles.customerSection}>
                    <div className={styles.infoRow}>
                      <FaUser className={styles.infoIcon} />
                      <span>{order.customer.name}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <FaPhone className={styles.infoIcon} />
                      <span>{order.customer.phone}</span>
                    </div>
                    {order.orderType === 'delivery' && order.customer.address && (
                      <div className={styles.infoRow}>
                        <FaMapMarkerAlt className={styles.infoIcon} />
                        <span className={styles.addressText}>{order.customer.address}</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.itemsSection}>
                    <div className={styles.itemsHeader}>
                      <FaUtensils className={styles.infoIcon} />
                      <span>{order.items.reduce((s, i) => s + i.quantity, 0)} items</span>
                    </div>
                    <div className={styles.itemsPreview}>
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className={styles.itemRow}>
                          <span className={styles.itemName}>
                            {item.isVegan && <FaLeaf className={styles.veganIcon} />}
                            {item.itemName}
                          </span>
                          <span className={styles.itemQty}>×{item.quantity}</span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <span className={styles.moreItems}>+{order.items.length - 3} more items</span>
                      )}
                    </div>
                  </div>

                  <div className={styles.paymentSection}>
                    <div className={styles.metaRow}>
                      <span>Method:</span>
                      <span className={styles.paymentMethodText}>
                        {order.paymentMethod === 'esewa' ? <><FaMobileAlt /> eSewa</> : <><FaMoneyBillWave /> Cash</>}
                      </span>
                    </div>
                    <div className={styles.metaRow}>
                      <span>Amount:</span>
                      <strong className={styles.amountText}>Rs. {order.totalAmount}</strong>
                    </div>
                    <div className={styles.metaRow}>
                      <span>Payment:</span>
                      <span className={`${styles.paymentStatusBadge} ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {getPaymentStatusBadge(order.paymentStatus)}
                      </span>
                    </div>
                  </div>

                  {order.specialInstructions && (
                    <div className={styles.specialInstructions}>
                      <FaExclamationCircle className={styles.infoIcon} />
                      <span>{order.specialInstructions}</span>
                    </div>
                  )}
                </div>

                <div className={styles.orderCardFooter}>
                  <button className={styles.viewBtn} onClick={() => viewOrderDetail(order)}>
                    <FaEye /> View
                  </button>
                  {getNextStatus(order.status) && (
                    <button 
                      className={styles.updateBtn}
                      onClick={() => updateOrderStatus(order.orderNumber, getNextStatus(order.status)!)}
                    >
                      {getNextStatusLabel(order.status)}
                    </button>
                  )}
                  {canMarkAsPaid(order) && (
                    <button 
                      className={styles.markPaidBtn}
                      onClick={() => updatePaymentStatus(order.orderNumber, 'COMPLETED')}
                    >
                      <FaCheckCircle /> Mark Paid
                    </button>
                  )}
                  {order.status === 'pending' && (
                    <button 
                      className={styles.cancelBtn}
                      onClick={() => updateOrderStatus(order.orderNumber, 'cancelled')}
                    >
                      <FaBan /> Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showOrderDetail && selectedOrder && (
        <div className={styles.modalOverlay} onClick={closeOrderDetail}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2>Order #{selectedOrder.orderNumber}</h2>
                <span className={styles.modalDate}>{formatFullDate(selectedOrder.createdAt)}</span>
              </div>
              <button onClick={closeOrderDetail} className={styles.closeBtn}>
                <FaTimes />
              </button>
            </div>
            <div className={styles.modalBody}>
              {/* Status Bar */}
              <div className={styles.statusBar}>
                <span className={`${styles.orderStatus} ${getStatusColor(selectedOrder.status)}`}>
                  {getStatusBadge(selectedOrder.status)}
                </span>
                <span className={styles.orderTypeBadge}>
                  {getOrderTypeIcon(selectedOrder.orderType)} {selectedOrder.orderType}
                </span>
                <span className={`${styles.paymentStatusBadge} ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                  {getPaymentStatusBadge(selectedOrder.paymentStatus)}
                </span>
              </div>

              <div className={styles.modalGrid}>
                {/* Left Column */}
                <div className={styles.modalLeft}>
                  <div className={styles.detailSection}>
                    <h3><FaUser /> Customer</h3>
                    <div className={styles.detailGrid}>
                      <div className={styles.detailRow}><span>Name</span><strong>{selectedOrder.customer.name}</strong></div>
                      <div className={styles.detailRow}><span>Phone</span><strong>{selectedOrder.customer.phone}</strong></div>
                      {selectedOrder.customer.email && (
                        <div className={styles.detailRow}><span>Email</span><strong>{selectedOrder.customer.email}</strong></div>
                      )}
                      {selectedOrder.customer.address && (
                        <div className={styles.detailRow}><span>Address</span><strong>{selectedOrder.customer.address}</strong></div>
                      )}
                    </div>
                  </div>

                  <div className={styles.detailSection}>
                    <h3><FaMoneyBillWave /> Payment</h3>
                    <div className={styles.detailGrid}>
                      <div className={styles.detailRow}>
                        <span>Method</span>
                        <strong>{selectedOrder.paymentMethod === 'esewa' ? <><FaMobileAlt /> eSewa</> : <><FaMoneyBillWave /> Cash</>}</strong>
                      </div>
                      <div className={styles.detailRow}>
                        <span>Status</span>
                        <span className={`${styles.paymentStatusBadge} ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                          {getPaymentStatusBadge(selectedOrder.paymentStatus)}
                        </span>
                      </div>
                      {selectedOrder.payments?.[0]?.paymentReference && (
                        <div className={styles.detailRow}>
                          <span>Reference</span>
                          <strong className={styles.monoText}>{selectedOrder.payments[0].paymentReference}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className={styles.modalRight}>
                  <div className={styles.detailSection}>
                    <h3><FaReceipt /> Price Breakdown</h3>
                    <div className={styles.detailGrid}>
                      <div className={styles.detailRow}><span>Subtotal</span><strong>Rs. {selectedOrder.subtotal}</strong></div>
                      <div className={styles.detailRow}><span>Tax (13%)</span><strong>Rs. {selectedOrder.tax}</strong></div>
                      {selectedOrder.serviceCharge > 0 && (
                        <div className={styles.detailRow}><span>Delivery Fee</span><strong>Rs. {selectedOrder.serviceCharge}</strong></div>
                      )}
                      <div className={styles.detailTotalRow}>
                        <span>Total</span>
                        <strong>Rs. {selectedOrder.totalAmount}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className={styles.detailSection}>
                <h3><FaUtensils /> Items ({selectedOrder.items.reduce((s, i) => s + i.quantity, 0)} total)</h3>
                <div className={styles.detailItemsList}>
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className={styles.detailItemCard}>
                      <div className={styles.detailItemHeader}>
                        <span className={styles.detailItemName}>
                          {item.isVegan && <FaLeaf className={styles.veganIcon} />}
                          {item.itemName}
                        </span>
                        <span className={styles.detailItemQty}>×{item.quantity}</span>
                      </div>
                      {item.addOns && item.addOns.length > 0 && (
                        <div className={styles.detailAddOns}>
                          {item.addOns.map((addon, idx) => (
                            <span key={idx} className={styles.detailAddon}>
                              + {addon.name} <span className={styles.detailAddonPrice}>(+Rs. {addon.price})</span>
                            </span>
                          ))}
                        </div>
                      )}
                      <div className={styles.detailItemPrice}>
                        <span>Rs. {item.basePrice} × {item.quantity}</span>
                        <strong>Rs. {item.totalPrice}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.specialInstructions && (
                <div className={styles.detailSection}>
                  <h3><FaExclamationCircle /> Special Instructions</h3>
                  <p className={styles.instructions}>{selectedOrder.specialInstructions}</p>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <div className={styles.modalFooterLeft}>
                {getNextStatus(selectedOrder.status) && (
                  <button 
                    className={styles.updateBtn}
                    onClick={() => {
                      updateOrderStatus(selectedOrder.orderNumber, getNextStatus(selectedOrder.status)!);
                      closeOrderDetail();
                    }}
                  >
                    {getNextStatusLabel(selectedOrder.status)}
                  </button>
                )}
                {canMarkAsPaid(selectedOrder) && (
                  <button 
                    className={styles.markPaidBtn}
                    onClick={() => {
                      updatePaymentStatus(selectedOrder.orderNumber, 'COMPLETED');
                      closeOrderDetail();
                    }}
                  >
                    <FaCheckCircle /> Mark as Paid
                  </button>
                )}
                {selectedOrder.status === 'pending' && (
                  <button 
                    className={styles.cancelBtn}
                    onClick={() => {
                      updateOrderStatus(selectedOrder.orderNumber, 'cancelled');
                      closeOrderDetail();
                    }}
                  >
                    <FaBan /> Cancel Order
                  </button>
                )}
              </div>
              <button className={styles.closeDetailBtn} onClick={closeOrderDetail}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}