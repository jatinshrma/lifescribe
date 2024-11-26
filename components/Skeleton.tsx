export const PostSkeleton = () => (
	<div className="py-6 ss:p-8 space-y-4 border-t border-darkSecondary group first:border-transparent ss:hover:border-transparent ss:[&:hover+div]:border-transparent">
		<div className="flex justify-between">
			<div className="flex gap-4 items-center">
				<p className="w-8 h-8 skeleton" />
				<p className="w-32 h-4 skeleton" />
			</div>

			<div className="flex gap-4 items-center">
				<p className="w-6 h-6 skeleton" />
				<p className="w-6 h-6 skeleton" />
			</div>
		</div>
		<p className="ss:my-6 h-4 skeleton w-3/4"></p>
		<div className="space-y-2">
			<div className="w-full h-4 skeleton" />
			<div className="w-full h-4 skeleton" />
		</div>
		<p className="w-16 h-4 skeleton" />
	</div>
)

export const ReadingListSkeleton = () => (
	<div className="border-b border-darkSecondary py-4 last:border-none">
		<div className="mb-4 flex justify-between">
			<div className="flex gap-2 items-center">
				<p className="w-7 h-7 skeleton" />
				<p className="w-16 h-3 skeleton" />
				<p className="w-8 h-3 skeleton" />
			</div>
			<p className="w-6 h-6 skeleton" />
		</div>
		<p className="w-4/5 h-3 skeleton" />
	</div>
)

export const TopArtistSkeleton = () => (
	<div className="border-b border-darkSecondary py-4 last:border-none">
		<div className="mb-4 flex items-center justify-between">
			<div className="flex gap-2 items-center">
				<p className="w-7 h-7 skeleton" />
				<p className="w-20 h-4 skeleton" />
			</div>

			<p className="w-12 h-4 skeleton" />
		</div>
		<div className="space-y-2">
			<p className="w-full h-3 skeleton" />
			<p className="w-4/5 h-3 skeleton" />
		</div>
	</div>
)

export const ProfileSkeleton = () => (
	<>
		<div className="flex items-center ss:gap-20 gap-6 ss:pt-[5rem] ss:pb-[72px] py-6">
			<div className="rounded-full aspect-square ss:w-[20rem] ss:h-[20rem] w-24 skeleton" />

			<div className="ss:space-y-4 space-y-3 ss:w-80 w-full">
				<p className="w-full ss:h-6 h-4 skeleton" />
				<div className="ss:block hidden space-y-2">
					<p className="w-full h-3 skeleton" />
					<p className="w-full h-3 skeleton" />
					<p className="w-24 h-3 skeleton" />
				</div>
				<div className="flex gap-4">
					<p className="w-20 ss:h-6 h-4 skeleton" />
					<p className="w-20 ss:h-6 h-4 skeleton" />
				</div>
			</div>
		</div>
		<div className="block ss:hidden space-y-2">
			<p className="w-full h-3 skeleton" />
			<p className="w-full h-3 skeleton" />
			<p className="w-24 h-3 skeleton" />
		</div>
	</>
)

export const BlogSkeleton = () => (
	<>
		<h1 className="post__title mb-0 w-2/3 h-6 skeleton" />
		<div className="ss:mt-12 ss:mb-8 my-6 flex justify-between">
			<div className="flex gap-4 items-center">
				<p className="w-12 h-12 skeleton" />
				<div className="flex gap-4">
					<p className="ss:w-40 w-20 h-4 skeleton" />
					<p className="ss:w-24 w-12 h-4 skeleton" />
				</div>
			</div>

			<div className="flex gap-4 items-center">
				<p className="ss:block hidden w-8 h-8 skeleton" />
				<p className="ss:block hidden w-8 h-8 skeleton" />
				<p className="w-8 h-8 skeleton" />
			</div>
		</div>
		<div className="space-y-2">
			<p className="w-full h-4 skeleton" />
			<p className="w-full h-4 skeleton" />
			<p className="w-1/2 h-4 skeleton" />
		</div>
	</>
)
