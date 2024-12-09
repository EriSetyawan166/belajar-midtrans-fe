// src/Checkout.tsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

declare global {
    interface Window {
        snap: any;
    }
}

const Checkout = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isSnapVisible, setIsSnapVisible] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        email: '',
        phone: '',
    });

    const [formError, setFormError] = useState({
        firstName: '',
        email: '',
        phone: '',
    });

    const [searchParams] = useSearchParams();
    console.log("successParam", searchParams);
    const orderId = searchParams.get('order_id');
    const statusCode = searchParams.get('status_code');
    const transactionStatus = searchParams.get('transaction_status');
    console.log("orderId", orderId);
    console.log("statusCode", statusCode);
    console.log("transactionStatus", transactionStatus);

    console.log("isSnapVisible", isSnapVisible);
    console.log("formData", formData);
    // Load the Midtrans Snap script dynamically
    useEffect(() => {

        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.type = 'text/javascript';
        script.async = true;
        script.setAttribute('data-client-key', import.meta.env.VITE_CLIENT_KEY as string);
        script.onload = () => {
            console.log('Midtrans Snap script loaded');
        };
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const validateForm = () => {
        let isValid = true;
        const errors = {
            firstName: '',
            email: '',
            phone: '',
        };

        if (!formData.firstName.trim()) {
            isValid = false;
            errors.firstName = 'Nama harus diisi.';
        }

        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
            isValid = false;
            errors.email = 'Email tidak valid.';
        }

        if (!formData.phone.trim() || !/^\d+$/.test(formData.phone)) {
            isValid = false;
            errors.phone = 'Nomor telepon harus berupa angka.';
        }

        setFormError(errors);
        return isValid;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setFormError({ ...formError, [name]: '' }); // Reset error message when user types
    };

    // Handle Buy Now click event
    const handleBuyClick = async () => {
        if (!validateForm()) {
            return;
        }
        setLoading(true);
        setError(null);

        try {
            // Call your backend to get the transaction token
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/transaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId: `ORDER-${Date.now()}`,
                    grossAmount: 10000,
                    firstName: formData.firstName,
                    lastName: '',
                    email: formData.email,
                    phone: formData.phone,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch transaction token');
            }

            const transactionToken = data.token;
            console.log("setIsSnapVisible", isSnapVisible);

            // Trigger the Snap payment window
            window.snap.embed(transactionToken, {
                embedId: 'snap-container',
                onSuccess: function (result: any) {
                    setIsSnapVisible(false);
                    console.log(result);
                    navigate('/success-payment', { state: { result } });
                },
                onPending: function (result: any) {
                    alert('Waiting for payment confirmation...');
                    console.log(result);
                },
                onError: function (result: any) {
                    alert('Payment Failed');
                    console.log(result);
                },
                onClose: function () {
                    alert('Payment window closed without completing');
                },
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
            setIsSnapVisible(true);
        }
    };

    return (
        <div className='flex flex-col justify-start gap-10 mt-24'>
            <div className="flex items-center justify-center py-4">
                <div className="flex w-full max-w-md items-center px-10 md:px-0">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center">
                        <div
                            className={`flex items-center justify-center w-8 h-8 font-bold rounded-full ${!isSnapVisible && transactionStatus !== 'settlement'
                                ? 'bg-teal-500 text-white'
                                : 'bg-gray-300 text-gray-500'
                                }`}
                        >
                            1
                        </div>
                        <span
                            className={`mt-2 text-sm font-medium ${!isSnapVisible && transactionStatus !== 'settlement'
                                ? 'text-teal-500'
                                : 'text-gray-500'
                                }`}
                        >
                            data diri
                        </span>
                    </div>

                    <div
                        className={`flex-1 border-t-2 ${isSnapVisible && transactionStatus !== 'settlement'
                            ? 'border-teal-500'
                            : 'border-gray-300'
                            }`}
                    ></div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center">
                        <div
                            className={`flex items-center justify-center w-8 h-8 font-bold rounded-full ${isSnapVisible && transactionStatus !== 'settlement'
                                ? 'bg-teal-500 text-white'
                                : 'bg-gray-300 text-gray-500'
                                }`}
                        >
                            2
                        </div>
                        <span
                            className={`mt-2 text-sm font-medium ${isSnapVisible && transactionStatus !== 'settlement'
                                ? 'text-teal-500'
                                : 'text-gray-500'
                                }`}
                        >
                            pembayaran
                        </span>
                    </div>

                    <div
                        className={`flex-1 border-t-2 ${transactionStatus === 'settlement' ? 'border-teal-500' : 'border-gray-300'
                            }`}
                    ></div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center">
                        <div
                            className={`flex items-center justify-center w-8 h-8 font-bold rounded-full ${transactionStatus === 'settlement'
                                ? 'bg-teal-500 text-white'
                                : 'bg-gray-300 text-gray-500'
                                }`}
                        >
                            3
                        </div>
                        <span
                            className={`mt-2 text-sm font-medium ${transactionStatus === 'settlement'
                                ? 'text-teal-500'
                                : 'text-gray-500'
                                }`}
                        >
                            selesai
                        </span>
                    </div>
                </div>

            </div>
            {
                (!isSnapVisible && transactionStatus !== 'settlement' && transactionStatus === null) && (
                    <div className="flex flex-col items-center md:flex-row  gap-10 md:items-start justify-center px-10">
                        <div className="bg-transparent rounded-xl w-full max-w-md flex flex-col text-[#1687A7] gap-3">
                            <p className='text-2xl font-semibold'>Detail Pembayaran</p>
                            <div>
                                <p className='font-medium text-2xl text-black'>Nama*</p>
                                <input type="text" className="peer block w-full px-4 py-2 text-lg text-gray-900 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    placeholder='Masukan Nama Anda' name="firstName"
                                    onChange={handleInputChange} />
                                {formError.firstName && <p className="text-red-500 text-sm">{formError.firstName}</p>}

                            </div>
                            <div>
                                <p className='font-medium text-2xl text-black'>Email*</p>
                                <input type="email" className="peer block w-full px-4 py-2 text-lg text-gray-900 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    placeholder='Masukan Alamat Email Anda'
                                    onChange={handleInputChange} name="email"

                                />
                                {formError.email && <p className="text-red-500 text-sm">{formError.email}</p>}

                            </div>
                            <div>
                                <p className='font-medium text-2xl text-black'>Nomor WA Aktif*</p>
                                <input type="number" name="phone"
                                    className="peer block w-full px-4 py-2 text-lg text-gray-900 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    placeholder='Masukan Nomor Whatsapp'
                                    onChange={handleInputChange} />
                                {formError.phone && <p className="text-red-500 text-sm">{formError.phone}</p>}

                            </div>
                        </div>
                        <div className="bg-[#E3F9FF] p-8 rounded-xl shadow-lg w-full max-w-md flex flex-col text-[#1687A7] gap-1">


                            <p className="text-lg font-medium mb-5">Rekap Pesanan Anda</p>
                            <table>
                                <tr className='text-gray-500 text-sm'>
                                    <td>
                                        <p>
                                            produk
                                        </p>
                                    </td>
                                    <td className='text-end'>
                                        Subtotal
                                    </td>
                                </tr>
                                <tr className='text-lg font-medium'>
                                    <td>
                                        <p>
                                            Spotify Premium Sharing
                                        </p>
                                    </td>
                                    <td className='text-end'>
                                        Rp35.000,-
                                    </td>
                                </tr>
                                <tr className='text-lg font-medium'>
                                    <td>
                                        <p>
                                            Spotify Premium Individual
                                        </p>
                                    </td>
                                    <td className='text-end'>
                                        Rp35.000,-
                                    </td>
                                </tr>
                                <tr className='text-gray-500 text-lg font-medium h-10'>
                                    <td>
                                        <p>
                                            Subtotal
                                        </p>
                                    </td>
                                    <td className='text-end'>
                                        Rp35.000,-
                                    </td>
                                </tr>
                                <tr className='border-gray-500 border-solid border-2'>
                                </tr>
                                <tr className='text-gray-500 text-lg font-medium h-10'>
                                    <td>
                                        <p>
                                            Biaya Admin
                                        </p>
                                    </td>
                                    <td className='text-end'>
                                        Rp5.000,-
                                    </td>
                                </tr>
                                <tr className='text-lg font-medium h-10'>
                                    <td>
                                        <p>
                                            Total
                                        </p>
                                    </td>
                                    <td className='text-end'>
                                        Rp40.000,-
                                    </td>
                                </tr>
                            </table>


                            {/* Error Message */}
                            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                            {/* Buy Button */}
                            <button
                                onClick={handleBuyClick}
                                disabled={loading}
                                className={`w-full py-3 text-white font-semibold rounded-lg transition-all duration-300 mt-5 text-xl
                        ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#276678] hover:bg-[#4aafcb] focus:outline-none'}`}
                            >
                                {loading ? 'Processing...' : 'Lanjutkan Pembayaran ->'}
                            </button>
                        </div>
                    </div>
                )
            }
            {
                transactionStatus === 'settlement' && (
                    <div className="flex flex-row gap-10 items-start justify-center">
                        <h1 className="text-3xl font-bold">Anggep aja ini sukses</h1>
                    </div>
                )
            }
            <div id='snap-container' className='md:px-44 w-full'>
            </div>

        </div >
    );
};

export default Checkout;
