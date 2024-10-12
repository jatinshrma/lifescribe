const Loading = () => {
	return (
		<div className="z-10 fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-darkPrimary">
			<div className="flex flex-col items-center -translate-y-1/3">
				<div className="custom-spinner ss:w-7 w-5 ss:h-7 h-5 border-5" />
				<h1 className="mt-8 tracking-wide font-playFD ss:text-5xl text-2xl font-bold">LifeScribe</h1>
			</div>
		</div>
	)
}

export default Loading
