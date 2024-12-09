
function succesPayment() {
    return (
        <div className='flex flex-col justify-start gap-10 mt-24'>
            <div className="flex items-center justify-center py-4">
                <div className="flex w-full max-w-md items-center">
                    <div className="flex flex-col items-center">
                        <div className={`flex items-center justify-center w-8 h-8 font-bold rounded-full bg-gray-300 text-gray-500 `}>
                            1
                        </div>
                        <span
                            className={`mt-2 text-sm font-medium text-gray-500`}>
                            data diri
                        </span>
                    </div>
                    <div className={`flex-1 border-t-2 border-gray-300`}></div>
                    <div className="flex flex-col items-center">
                        <div className={`flex items-center justify-center w-8 h-8 font-bold rounded-full bg-gray-300 text-gray-500 `}>
                            2
                        </div>
                        <span className={`mt-2 text-sm font-medium text-gray-500 `}>pembayaran</span>
                    </div>
                    <div className={`flex-1 border-t-2 border-teal-500`}></div>
                    <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center w-8 h-8 bg-teal-500 text-white font-bold rounded-full">
                            3
                        </div>
                        <span className="mt-2 text-gray-500 text-sm font-medium">selesai</span>
                    </div>
                </div>
            </div >
            <div className="flex flex-row gap-10 items-start justify-center">
                <h1 className="text-3xl font-bold">Anggep aja ini sukses</h1>
            </div>
        </div >
    )
}

export default succesPayment