export const PostSkeleton = () => (
	<div className="p-8 space-y-4 border-t border-darkSecondary group first:border-transparent hover:border-transparent [&:hover+div]:border-transparent">
		<div className="flex justify-between">
			<div className="flex gap-4 items-center">
				<p className="w-8 h-8 bg-gray-200 rounded-full dark:bg-neutral-700" />
				<p className="w-32 h-4 bg-gray-200 rounded-full dark:bg-neutral-700" />
			</div>

			<div className="flex gap-4 items-center">
				<p className="w-6 h-6 bg-gray-200 rounded-full dark:bg-neutral-700" />
				<p className="w-6 h-6 bg-gray-200 rounded-full dark:bg-neutral-700" />
			</div>
		</div>
		<p className="my-6 h-4 bg-gray-200 rounded-full dark:bg-neutral-700 w-3/4"></p>
		<div className="space-y-2">
			<div className="w-full h-4 bg-gray-200 rounded-full dark:bg-neutral-700" />
			<div className="w-full h-4 bg-gray-200 rounded-full dark:bg-neutral-700" />
		</div>
		<p className="w-16 h-4 bg-gray-200 rounded-full dark:bg-neutral-700" />
	</div>
)

export const ReadingListSkeleton = () => (
	<div className="border-b border-darkSecondary py-4 last:border-none">
		<div className="mb-4 flex justify-between">
			<div className="flex gap-2 items-center">
				<p className="w-7 h-7 bg-gray-200 rounded-full dark:bg-neutral-700" />
				<p className="w-16 h-3 bg-gray-200 rounded-full dark:bg-neutral-700" />
				<p className="w-8 h-3 bg-gray-200 rounded-full dark:bg-neutral-700" />
			</div>
			<p className="w-6 h-6 bg-gray-200 rounded-full dark:bg-neutral-700" />
		</div>
		<p className="w-4/5 h-3 bg-gray-200 rounded-full dark:bg-neutral-700" />
	</div>
)

export const TopArtistSkeleton = () => (
	<div className="border-b border-darkSecondary py-4 last:border-none">
		<div className="mb-4 flex items-center justify-between">
			<div className="flex gap-2 items-center">
				<p className="w-7 h-7 bg-gray-200 rounded-full dark:bg-neutral-700" />
				<p className="w-20 h-4 bg-gray-200 rounded-full dark:bg-neutral-700" />
			</div>

			<p className="w-12 h-4 bg-gray-200 rounded-full dark:bg-neutral-700" />
		</div>
		<div className="space-y-2">
			<p className="w-full h-3 bg-gray-200 rounded-full dark:bg-neutral-700" />
			<p className="w-4/5 h-3 bg-gray-200 rounded-full dark:bg-neutral-700" />
		</div>
	</div>
)

export const ProfileSkeleton = () => (
	<div className="flex items-center gap-20 pt-[5rem] pb-[72px]">
		<div className="rounded-full aspect-square w-[20rem] h-[20rem] bg-gray-200 dark:bg-neutral-700" />

		<div className="space-y-4 w-80">
			<p className="w-full h-6 bg-gray-200 rounded-full dark:bg-neutral-700" />
			<div className="space-y-2">
				<p className="w-full h-3 bg-gray-200 rounded-full dark:bg-neutral-700" />
				<p className="w-full h-3 bg-gray-200 rounded-full dark:bg-neutral-700" />
				<p className="w-24 h-3 bg-gray-200 rounded-full dark:bg-neutral-700" />
			</div>
			<div className="flex gap-4">
				<p className="w-20 h-6 bg-gray-200 rounded-full dark:bg-neutral-700" />
				<p className="w-20 h-6 bg-gray-200 rounded-full dark:bg-neutral-700" />
			</div>
		</div>
	</div>
)

export const BlogSkeleton = () => (
	<>
		<h1 className="post__title mb-0 w-2/3 h-6 bg-gray-200 rounded-full dark:bg-neutral-700" />
		<div className="mt-12 mb-8 flex justify-between">
			<div className="flex gap-4 items-center">
				<p className="w-12 h-12 bg-gray-200 rounded-full dark:bg-neutral-700" />
				<div className="flex gap-4">
					<p className="w-40 h-4 bg-gray-200 rounded-full dark:bg-neutral-700" />
					<p className="w-24 h-4 bg-gray-200 rounded-full dark:bg-neutral-700" />
				</div>
			</div>

			<div className="flex gap-4 items-center">
				<p className="w-8 h-8 bg-gray-200 rounded-full dark:bg-neutral-700" />
				<p className="w-8 h-8 bg-gray-200 rounded-full dark:bg-neutral-700" />
				<p className="w-8 h-8 bg-gray-200 rounded-full dark:bg-neutral-700" />
			</div>
		</div>
		<div className="space-y-2">
			<p className="w-full h-4 bg-gray-200 rounded-full dark:bg-neutral-700" />
			<p className="w-full h-4 bg-gray-200 rounded-full dark:bg-neutral-700" />
			<p className="w-1/2 h-4 bg-gray-200 rounded-full dark:bg-neutral-700" />
		</div>
	</>
)
