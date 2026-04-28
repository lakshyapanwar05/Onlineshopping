import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import { LogOut, Package, Clock, CheckCircle, User } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await ordersAPI.getUserOrders(user.id);
        setOrders(res.data || []);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="pt-24 pb-16 min-h-screen max-w-5xl mx-auto px-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12 pb-6 border-b border-white/10">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-widest text-white mb-2">My Account</h1>
          <p className="text-white/60 flex items-center gap-2">
            <User size={16} />
            {user.name} ({user.email})
          </p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-sm transition-colors uppercase tracking-wider text-sm font-medium"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      <h2 className="font-display text-2xl uppercase tracking-widest text-white mb-6 flex items-center gap-3">
        <Package className="text-neon" /> Order History
      </h2>

      {/* Orders */}
      {loading ? (
        <div className="flex justify-center py-20 text-white/50">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-sm p-12 text-center">
          <p className="text-white/60 mb-4">You haven't placed any orders yet.</p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-dark-surface border border-white/5 rounded-sm overflow-hidden">
              <div className="bg-white/5 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Order #{order.id}</p>
                  <p className="text-white text-sm">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                  {order.payments && order.payments.length > 0 && (
                    <p className="text-neon/80 text-xs mt-1 font-medium bg-neon/10 inline-block px-2 py-0.5 rounded-sm">
                      Paid via {order.payments[0].payment_method}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                    order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-white/10 text-white/70'
                  }`}>
                    {order.status}
                  </div>
                  <p className="text-neon font-bold text-lg">${Number(order.total_amount).toFixed(2)}</p>
                </div>
              </div>
              
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {order.items?.map(item => (
                    <div key={item.item_id} className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-white/5 rounded-sm overflow-hidden flex-shrink-0">
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{item.name}</p>
                        <p className="text-white/40 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-white/70 text-sm">${Number(item.line_total).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
