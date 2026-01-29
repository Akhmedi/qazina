export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container-max">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-finovate-orange to-finovate-orange-hover rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">Q</span>
            </div>
            <span className="text-2xl font-bold">Qazinv</span>
          </div>
          <p className="text-gray-400">Email: info@qazinv.kz</p>
        </div>
      </div>
    </footer>
  )
}