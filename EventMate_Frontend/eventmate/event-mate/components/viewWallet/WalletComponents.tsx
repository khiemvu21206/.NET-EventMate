'use client';
import { useState, useEffect } from 'react';
import { WalletRepository } from '@/repositories/WalletRepository';
import styles from '@/styles/WalletComponents.module.css';
import { useUserContext } from '@/providers/UserProvider';

interface Transaction {
  transactionId: string;
  type: string;
  method: string;
  amount: number;
  status: number;
  createdAt: string;
}

interface WalletInfo {
  walletId: string;
  balance: number;
  transactions: Transaction[];
}

interface BankInfo {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export const WalletComponent = () => {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [bankInfo, setBankInfo] = useState<BankInfo>({
    bankName: '',
    accountNumber: '',
    accountName: ''
  });
  const { status, token } = useUserContext();

  const handleOpenModal = (type: 'deposit' | 'withdraw') => {
    setModalType(type);
    setIsModalOpen(true);
    setAmount('');
    setMethod('');
    setBankInfo({
      bankName: '',
      accountNumber: '',
      accountName: ''
    });
    setError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  const handleTransaction = async () => {
    try {
      if (!token) {
        setError('Vui lòng đăng nhập để thực hiện giao dịch');
        return;
      }

      const amountNumber = parseFloat(amount);
      if (isNaN(amountNumber) || amountNumber <= 0) {
        setError('Vui lòng nhập số tiền hợp lệ');
        return;
      }

      if (!method.trim()) {
        setError('Vui lòng nhập phương thức thanh toán');
        return;
      }

      if (modalType === 'withdraw') {
        if (!bankInfo.bankName.trim() || !bankInfo.accountNumber.trim() || !bankInfo.accountName.trim()) {
          setError('Vui lòng nhập đầy đủ thông tin ngân hàng');
          return;
        }
      }

      const response = await (modalType === 'deposit'
        ? WalletRepository.deposit({ amount: amountNumber, method }, token)
        : WalletRepository.withdraw({ 
            amount: amountNumber, 
            method,
            bankInfo: {
              bankName: bankInfo.bankName,
              accountNumber: bankInfo.accountNumber,
              accountName: bankInfo.accountName
            }
          }, token));

      if (response.status === 200) {
        setSuccess(`${modalType === 'deposit' ? 'Nạp' : 'Rút'} tiền thành công!`);
        handleCloseModal();
        fetchWalletInfo();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Giao dịch thất bại. Vui lòng thử lại.');
      }
    } catch (error: any) {
      console.error('Transaction error:', error);
      setError(error.message || 'Có lỗi xảy ra khi thực hiện giao dịch');
    }
  };

  const fetchWalletInfo = async () => {
    try {
      if (status === 'loading') {
        return;
      }

      if (!token || status !== 'authenticated') {
        setError('Vui lòng đăng nhập để xem thông tin ví');
        return;
      }

      const response = await WalletRepository.getWalletInfo(token);
      console.log('Raw API Response:', response);
      
      if (!response || !response.data) {
        console.error('Invalid response structure:', response);
        setError('Không thể tải thông tin ví');
        return;
      }

      const walletData = response.data;
      console.log('Wallet data:', walletData);

      if (!walletData.walletId || typeof walletData.balance !== 'number') {
        console.error('Invalid wallet data structure:', walletData);
        setError('Dữ liệu ví không hợp lệ');
        return;
      }

      setWalletInfo(walletData);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching wallet info:', error);
      if (error.message === 'Unauthorized') {
        setError('Vui lòng đăng nhập lại để xem thông tin ví');
      } else if (error.message.startsWith('API Error:')) {
        setError(`Lỗi từ server: ${error.message}`);
      } else {
        setError('Có lỗi xảy ra khi tải thông tin ví');
      }
    }
  };

  useEffect(() => {
    fetchWalletInfo();
  }, [status, token]);

  return (
    <div className={styles.container}>
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}
      
      <div className={styles.walletCard}>
        <div className={styles.balanceInfo}>
          <div className={styles.totalBalance}>
            <span>Total Balance</span>
            <h1>${walletInfo?.balance?.toFixed(2) || '0.00'}</h1>
          </div>
          <button className={styles.addMoney}>+ Add Money</button>
        </div>

        <div className={styles.actionButtons}>
          <button className={styles.actionButton} onClick={() => handleOpenModal('withdraw')}>
            <span>↑</span>
            Withdraw Money
          </button>
          <button className={styles.actionButton} onClick={() => handleOpenModal('deposit')}>
            <span>↓</span>
            Deposit Money
          </button>
        </div>
      </div>

      <div className={styles.quickActions}>
        <h2>Quick Actions</h2>
        <div className={styles.actionGrid}>
          <div className={styles.actionItem}>
            <div className={styles.actionIcon}>≡</div>
            <span>Pay Bills</span>
          </div>
          <div className={styles.actionItem}>
            <div className={styles.actionIcon}>📱</div>
            <span>Mobile Recharge</span>
          </div>
          <div className={styles.actionItem}>
            <div className={styles.actionIcon}>🎬</div>
            <span>Movie Tickets</span>
          </div>
          <div className={styles.actionItem}>
            <div className={styles.actionIcon}>🎁</div>
            <span>Rewards</span>
          </div>
        </div>
      </div>

      <div className={styles.transactions}>
        <div className={styles.transactionHeader}>
          <h2>Recent Transactions</h2>
          <a href="#" className={styles.viewAll}>View All</a>
        </div>
        <div className={styles.transactionList}>
          {walletInfo?.transactions?.slice(0, 4).map((item) => (
            <div key={item.transactionId} className={styles.transactionItem}>
              <div className={styles.transactionInfo}>
                <div className={styles.transactionIcon}>
                  {item.type === 'Deposit' ? '↓' : '↑'}
                </div>
                <div className={styles.transactionDetails}>
                  <strong>{item.method}</strong>
                  <span>{new Date(item.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <span className={item.type === 'Deposit' ? styles.positive : styles.negative}>
                {item.type === 'Deposit' ? '+' : '-'}${Math.abs(item.amount).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>{modalType === 'deposit' ? 'Nạp Tiền' : 'Rút Tiền'}</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="amount">Số tiền:</label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Nhập số tiền"
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="method">Phương thức thanh toán:</label>
              <input
                type="text"
                id="method"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                placeholder="Ví dụ: Momo, ZaloPay, Banking..."
              />
            </div>

            {modalType === 'withdraw' && (
              <>
                <div className={styles.formGroup}>
                  <label htmlFor="bankName">Tên ngân hàng:</label>
                  <input
                    type="text"
                    id="bankName"
                    value={bankInfo.bankName}
                    onChange={(e) => setBankInfo({...bankInfo, bankName: e.target.value})}
                    placeholder="Nhập tên ngân hàng"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="accountNumber">Số tài khoản:</label>
                  <input
                    type="text"
                    id="accountNumber"
                    value={bankInfo.accountNumber}
                    onChange={(e) => setBankInfo({...bankInfo, accountNumber: e.target.value})}
                    placeholder="Nhập số tài khoản"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="accountName">Tên chủ tài khoản:</label>
                  <input
                    type="text"
                    id="accountName"
                    value={bankInfo.accountName}
                    onChange={(e) => setBankInfo({...bankInfo, accountName: e.target.value})}
                    placeholder="Nhập tên chủ tài khoản"
                  />
                </div>
              </>
            )}

            <div className={styles.modalButtons}>
              <button 
                className={`${styles.actionButton} ${styles.cancelButton}`}
                onClick={handleCloseModal}
              >
                Hủy
              </button>
              <button 
                className={`${styles.actionButton} ${styles.confirmButton}`}
                onClick={handleTransaction}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
