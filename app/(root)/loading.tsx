const Loading = () => {
	return (
		<div className="z-10 fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-darkPrimary">
			<div className="flex flex-col items-center -translate-y-1/3">
				<div className="custom-spinner w-7 h-7 border-4" />
				<h1 className="mt-8 tracking-wide font-playFD text-5xl font-bold">LifeScribe</h1>
			</div>
		</div>
	)
}

export default Loading
