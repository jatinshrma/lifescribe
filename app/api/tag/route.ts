import { Tag } from "@db/models"
import { NextRequest, NextResponse } from "next/server"

const tags = [
	{
		n: "Technology",
		c: [
			{
				n: "Software",
				c: [
					{
						n: "Software Development",
						c: [
							{
								n: "Frontend",
								c: [
									{
										n: "React"
									},
									{
										n: "Vue"
									}
								]
							},
							{
								n: "Backend",
								c: [
									{
										n: "Node.js"
									},
									{
										n: "Django"
									}
								]
							}
						]
					},
					{
						n: "Apps"
					}
				]
			},
			{
				n: "Gadgets",
				c: [
					{
						n: "Smartphones",
						c: [
							{
								n: "Android"
							},
							{
								n: "iOS"
							}
						]
					},
					{
						n: "Wearables",
						c: [
							{
								n: "Smartwatches"
							},
							{
								n: "Fitness Trackers"
							}
						]
					}
				]
			}
		]
	},
	{
		n: "Health Care",
		c: [
			{
				n: "Beauty & Nourishment",
				c: [
					{
						n: "Skin care"
					},
					{
						n: "Hair care"
					}
				]
			},
			{
				n: "Fitness",
				c: [
					{
						n: "Exercise",
						c: [
							{
								n: "Yoga"
							},
							{
								n: "Strength Training",
								c: [
									{
										n: "Weights"
									},
									{
										n: "Bodyweight Exercises"
									}
								]
							},
							{
								n: "Cardio",
								c: [
									{
										n: "Running"
									},
									{
										n: "Cycling"
									}
								]
							}
						]
					}
				]
			}
		]
	},
	{
		n: "Finance",
		c: [
			{
				n: "Investing",
				c: [
					{
						n: "Stocks"
					},
					{
						n: "Real Estate",
						c: [
							{
								n: "Residential"
							},
							{
								n: "Commercial"
							}
						]
					}
				]
			},
			{
				n: "Saving",
				c: [
					{
						n: "Budgeting"
					},
					{
						n: "Emergency Fund"
					}
				]
			}
		]
	},
	{
		n: "Travel",
		c: [
			{
				n: "Destinations",
				c: [
					{
						n: "Europe",
						c: [
							{
								n: "France"
							},
							{
								n: "Italy"
							}
						]
					},
					{
						n: "Asia",
						c: [
							{
								n: "Japan"
							},
							{
								n: "Thailand"
							}
						]
					}
				]
			},
			{
				n: "Travel Tips",
				c: [
					{
						n: "Packing"
					},
					{
						n: "Budget Travel"
					}
				]
			}
		]
	},
	{
		n: "Food",
		c: [
			{
				n: "Recipes",
				c: [
					{
						n: "Vegetarian"
					},
					{
						n: "Desserts"
					}
				]
			},
			{
				n: "Nutrition",
				c: [
					{
						n: "Vitamins"
					},
					{
						n: "Dietary Supplements"
					}
				]
			}
		]
	},
	{
		n: "Education",
		c: [
			{
				n: "Online Learning",
				c: [
					{
						n: "MOOCs"
					},
					{
						n: "Webinars"
					}
				]
			},
			{
				n: "School",
				c: [
					{
						n: "Elementary"
					},
					{
						n: "High School"
					}
				]
			}
		]
	},
	{
		n: "Lifestyle",
		c: [
			{
				n: "Fashion",
				c: [
					{
						n: "Trends"
					},
					{
						n: "Sustainable Fashion"
					}
				]
			},
			{
				n: "Hobbies",
				c: [
					{
						n: "Photography"
					},
					{
						n: "Gardening"
					}
				]
			}
		]
	},
	{
		n: "Business",
		c: [
			{
				n: "Entrepreneurship",
				c: [
					{
						n: "Startups"
					},
					{
						n: "Small Business"
					}
				]
			},
			{
				n: "Management",
				c: [
					{
						n: "Leadership"
					},
					{
						n: "Strategy"
					}
				]
			}
		]
	},
	{
		n: "Entertainment",
		c: [
			{
				n: "Movies",
				c: [
					{
						n: "Reviews"
					},
					{
						n: "Trailers"
					}
				]
			},
			{
				n: "Music",
				c: [
					{
						n: "Albums"
					},
					{
						n: "Concerts"
					}
				]
			}
		]
	},
	{
		n: "Science",
		c: [
			{
				n: "Astronomy",
				c: [
					{
						n: "Solar System",
						c: [
							{
								n: "Planets"
							},
							{
								n: "Moons"
							}
						]
					},
					{
						n: "Deep Space",
						c: [
							{
								n: "Galaxies"
							},
							{
								n: "Nebulae"
							}
						]
					},
					{
						n: "Space Exploration"
					},
					{
						n: "Telescopes"
					}
				]
			},
			{
				n: "Biology",
				c: [
					{
						n: "Genetics"
					},
					{
						n: "Evolution"
					}
				]
			}
		]
	},
	{
		n: "Environment",
		c: [
			{
				n: "Climate Change",
				c: [
					{
						n: "Global Warming"
					},
					{
						n: "Carbon Footprint"
					}
				]
			},
			{
				n: "Conservation",
				c: [
					{
						n: "Wildlife"
					},
					{
						n: "Forests"
					}
				]
			}
		]
	},
	{
		n: "Sports",
		c: [
			{
				n: "Football",
				c: [
					{
						n: "Premier League"
					},
					{
						n: "World Cup"
					}
				]
			},
			{
				n: "Basketball",
				c: [
					{
						n: "NBA"
					},
					{
						n: "EuroLeague"
					}
				]
			}
		]
	},
	{
		n: "Politics",
		c: [
			{
				n: "Elections",
				c: [
					{
						n: "Campaigns"
					},
					{
						n: "Debates"
					}
				]
			},
			{
				n: "Policy",
				c: [
					{
						n: "Healthcare Policy"
					},
					{
						n: "Education Policy"
					}
				]
			}
		]
	},
	{
		n: "Culture",
		c: [
			{
				n: "Art",
				c: [
					{
						n: "Painting"
					},
					{
						n: "Sculpture"
					}
				]
			},
			{
				n: "History",
				c: [
					{
						n: "Ancient"
					},
					{
						n: "Modern"
					}
				]
			}
		]
	},
	{
		n: "Automotive",
		c: [
			{
				n: "Cars",
				c: [
					{
						n: "Electric"
					},
					{
						n: "Hybrid"
					}
				]
			},
			{
				n: "Motorcycles",
				c: [
					{
						n: "Sport"
					},
					{
						n: "Cruiser"
					}
				]
			}
		]
	},
	{
		n: "DIY",
		c: [
			{
				n: "Crafts",
				c: [
					{
						n: "Knitting",
						c: [
							{
								n: "Knitting Patterns"
							},
							{
								n: "Knitting Materials"
							}
						]
					},
					{
						n: "Scrapbooking"
					}
				]
			},
			{
				n: "Home Improvement",
				c: [
					{
						n: "Renovation"
					},
					{
						n: "Decorating"
					}
				]
			}
		]
	},
	{
		n: "Parenting",
		c: [
			{
				n: "Pregnancy",
				c: [
					{
						n: "First Trimester"
					},
					{
						n: "Second Trimester"
					}
				]
			},
			{
				n: "Child Development",
				c: [
					{
						n: "Toddlers"
					},
					{
						n: "Teenagers"
					}
				]
			}
		]
	},
	{
		n: "Pets",
		c: [
			{
				n: "Dogs",
				c: [
					{
						n: "Training"
					},
					{
						n: "Grooming"
					}
				]
			},
			{
				n: "Cats",
				c: [
					{
						n: "Health"
					},
					{
						n: "Behavior"
					}
				]
			}
		]
	},
	{
		n: "Gaming",
		c: [
			{
				n: "PC Gaming"
			},
			{
				n: "Console Gaming",
				c: [
					{
						n: "PlayStation"
					},
					{
						n: "Xbox"
					}
				]
			}
		]
	},
	{
		n: "Self Improvement",
		c: [
			{
				n: "Mindfulness",
				c: [
					{
						n: "Meditation"
					},
					{
						n: "Breathing Exercises"
					}
				]
			},
			{
				n: "Productivity",
				c: [
					{
						n: "Time Management"
					},
					{
						n: "Goal Setting"
					}
				]
			}
		]
	},
	{
		n: "Home",
		c: [
			{
				n: "Cleaning",
				c: [
					{
						n: "Organizing"
					},
					{
						n: "Decluttering"
					}
				]
			},
			{
				n: "Decor",
				c: [
					{
						n: "Interior Design"
					},
					{
						n: "Seasonal Decor"
					}
				]
			}
		]
	},
	{
		n: "Gardening",
		c: [
			{
				n: "Vegetable Gardening",
				c: [
					{
						n: "Raised Beds"
					},
					{
						n: "Container Gardening"
					}
				]
			},
			{
				n: "Flower Gardening",
				c: [
					{
						n: "Perennials"
					},
					{
						n: "Annuals"
					}
				]
			}
		]
	},
	{
		n: "Writing",
		c: [
			{
				n: "Creative Writing",
				c: [
					{
						n: "Fiction"
					},
					{
						n: "Poetry"
					}
				]
			},
			{
				n: "Non-fiction",
				c: [
					{
						n: "Biographies"
					},
					{
						n: "Essays"
					}
				]
			}
		]
	},
	{
		n: "Music",
		c: [
			{
				n: "Genres",
				c: [
					{
						n: "Rock"
					},
					{
						n: "Jazz"
					}
				]
			},
			{
				n: "Instruments",
				c: [
					{
						n: "Guitar"
					},
					{
						n: "Piano"
					}
				]
			}
		]
	},
	{
		n: "Photography",
		c: [
			{
				n: "Techniques",
				c: [
					{
						n: "Portrait"
					},
					{
						n: "Landscape"
					}
				]
			},
			{
				n: "Equipment",
				c: [
					{
						n: "Cameras"
					},
					{
						n: "Lenses"
					}
				]
			}
		]
	},
	{
		n: "Movies",
		c: [
			{
				n: "Genres",
				c: [
					{
						n: "Action"
					},
					{
						n: "Comedy"
					}
				]
			},
			{
				n: "Reviews",
				c: [
					{
						n: "Critics"
					},
					{
						n: "User Reviews"
					}
				]
			}
		]
	},
	{
		n: "Books",
		c: [
			{
				n: "Genres",
				c: [
					{
						n: "Fiction"
					},
					{
						n: "Non-fiction"
					}
				]
			},
			{
				n: "Reviews",
				c: [
					{
						n: "Critics"
					},
					{
						n: "User Reviews"
					}
				]
			}
		]
	},
	{
		n: "Theater",
		c: [
			{
				n: "Plays",
				c: [
					{
						n: "Drama"
					},
					{
						n: "Comedy"
					}
				]
			},
			{
				n: "Musicals",
				c: [
					{
						n: "Broadway"
					},
					{
						n: "Off-Broadway"
					}
				]
			}
		]
	},
	{
		n: "Architecture",
		c: [
			{
				n: "Styles",
				c: [
					{
						n: "Modern"
					},
					{
						n: "Gothic"
					}
				]
			},
			{
				n: "Projects",
				c: [
					{
						n: "Residential"
					},
					{
						n: "Commercial"
					}
				]
			}
		]
	},
	{
		n: "Social Media",
		c: [
			{
				n: "Platforms",
				c: [
					{
						n: "Facebook"
					},
					{
						n: "Instagram"
					}
				]
			},
			{
				n: "Strategies",
				c: [
					{
						n: "Content Creation"
					},
					{
						n: "Engagement"
					}
				]
			}
		]
	},
	{
		n: "Beauty",
		c: [
			{
				n: "Makeup",
				c: [
					{
						n: "Tutorials"
					},
					{
						n: "Reviews"
					}
				]
			},
			{
				n: "Skincare",
				c: [
					{
						n: "Products"
					},
					{
						n: "Routines"
					}
				]
			}
		]
	},
	{
		n: "Religion",
		c: [
			{
				n: "Christianity",
				c: [
					{
						n: "Bible Studies"
					},
					{
						n: "Church Services"
					}
				]
			},
			{
				n: "Islam",
				c: [
					{
						n: "Quran Studies"
					},
					{
						n: "Mosque Services"
					}
				]
			}
		]
	},
	{
		n: "Astrology",
		c: [
			{
				n: "Zodiac Signs",
				c: [
					{
						n: "Daily Horoscopes"
					},
					{
						n: "Compatibility"
					}
				]
			},
			{
				n: "Astrological Charts",
				c: [
					{
						n: "Birth Chart"
					},
					{
						n: "Transit Chart"
					}
				]
			}
		]
	},
	{
		n: "Philosophy",
		c: [
			{
				n: "Ancient Philosophy",
				c: [
					{
						n: "Platonism"
					},
					{
						n: "Stoicism"
					}
				]
			},
			{
				n: "Modern Philosophy",
				c: [
					{
						n: "Existentialism"
					},
					{
						n: "Postmodernism"
					}
				]
			}
		]
	}
]

export const GET = async (request: NextRequest) => {
	try {
		const failedTags = []
		const processTagCollection = async (coll, parentId) => {
			for (const i of coll) {
				let thisTagId
				try {
					thisTagId = await Tag.create({
						name: i.n,
						...(parentId ? { parent: parentId } : {})
					})
				} catch (error) {
					failedTags.push(i.n)
				}

				if (i?.c?.length > 0) {
					await processTagCollection(i.c, thisTagId?._id)
				}
			}
		}

		await processTagCollection(tags)
		return NextResponse.json(failedTags)
	} catch (error) {
		return NextResponse.json(error)
	}
}
