import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function StepByStepGov() {

  const guides = [
   
    {

        title: "How to view your profile",

        steps: [

          "press on the sidebar",
          "select view profile ",

        ]

      },


      {


      title: "How to delete your profile",

      steps: [

        "press on the sidebar",
        "select view profile ",
        "press on edit button",
        "press on delete account",


      ]

    },


    {
        title: "How to edit your profile",

        steps: [
  
          "press on the sidebar",
          "select view profile ",
          "press on edit",
          
  
        ]

      },


      {

        title: "How to update your profile",

        steps: [
  
          "press on the sidebar",
          "select view profile ",
          "press on edit",
          "press update profile"
          
  
        ]


      },


      {

        title: "How to update your password",

        steps: [
  
          "press on the sidebar",
          "select view profile ",
          "press on edit",
          "press update password"
          
  
        ]


      },



      {

        title: "How to create histroical places",

        steps: [
  
          "press on the sidebar",
          "select create histroical places ",
          "fill all the fields",
          "press update password",
          "press create historical places "

          ]

      },



      {

        title: "How to search and filter in historical places",

        steps: [

          "press on the navbar",
          "select historical places",
          "filter with name",
          "press search "

        ]

      },


      {

        title: "How to search and filter in historical places",

        steps: [

          "press on the navbar",
          "select historical places ",
          "filter with tag",
          "press search "

        ]

      },



    {

        title: "How to search and filter in activites",

        steps: [

          "press on the navbar",
          "select activities",
          "filter with name",
          "press search and filter"

        ]

      },



      {

        title: "How to search and filter in activites",

        steps: [

          "press on the navbar",
          "select activities",
          "filter with category",
          "press search and filter"

        ]

      },


      {

        title: "How to search and filter in activites",

        steps: [

          "press on the navbar",
          "select activities",
          "filter with tag",
          "press search and filter"

        ]


      },


      {

        title: "How to search and filter with extra details in activites",

        steps: [

          "press on the navbar",
          "select activities",
          "press on the options button",
          "filter with Min price,max rating",
          "press search and filter"

        ]


      },


      {

      title: "How to search and filter with extra details in activites",

      steps: [

        "press on the navbar",
        "select activities",
        "press on the options button",
        "filter with Min rating",
        "press search and filter"

      ]


    },


    {

    title: "How to search and filter with extra details in activites",

    steps: [

      "press on the navbar",
      "select activities",
      "press on the options button",
      "filter with start date,end date",
      "press search and filter"

    ]


  },


  {

    title: "How to search and filter with extra details in activites",

    steps: [

      "press on the navbar",
      "select activities",
      "press on the options button",
      "filter with sort by,by order",
      "press search and filter"


    ]

  },


  {

    title: "How to search and filter in itineraries",

    steps: [

      "press on the navbar",
      "select itineraries",
      "filter with name",
      "press search and filter"


    ]

  },


  {

    title: "How to search and filter with extra details in itineraries",

    steps: [

      "press on the navbar",
      "select itineraries",
      "press on the options button",
      "filter with min price,max price",
      "press search and filter"


    ]

  },


  {

  title: "How to search and filter with extra details in itineraries",

  steps: [

    "press on the navbar",
    "select itineraries",
    "press on the options button",
    "filter with Min rating",
    "press search and filter"


  ]

},


{

title: "How to search and filter with extra details in itineraries",

steps: [

  "press on the navbar",
  "select itineraries",
  "press on the options button",
  "filter with start date,end date",
  "press search and filter"


]


},


{

title: "How to search and filter with extra details in itineraries",

steps: [

  "press on the navbar",
  "select itineraries",
  "press on the options button",
  "filter with sort by,by order",
  "press search and filter"


]

},

      {

        title: "How to view historical places",

        steps: [

          "press on the sidebar",
          "select view historical places ",


        ]

      },

    {

      title: "How to delete historical places",

      steps: [

        "press on the sidebar",
        "select view historical places ",
        "select delete button",
        "press ok",
       

      ]

    },

    {

      title: "How to edit histroical places ",

      steps: [

        "press on the sidebar",
        "select view historical places ",
        "select edit button",
        "edit name,description,location,period or tags",
        "press save"
       

      ]

    },
   
  ]



 return (

    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">

        Step-by-Step Guides
      </h1>

      <Card className="shadow-lg border border-blue-200">
        <CardHeader className="bg-blue-50 p-4 rounded-t">

          <CardTitle className="text-2xl font-semibold text-blue-800">
          Tourist Governor 

          </CardTitle>
        </CardHeader>

        <CardContent className="p-4">
          <Accordion type="single" collapsible className="w-full space-y-2">

            {guides.map((guide, index) => (
              <AccordionItem

                key={index}
                value={`guide-${index}`}

                className="border border-blue-100 rounded-md overflow-hidden"
              >

                <AccordionTrigger className="text-blue-600 font-medium hover:text-blue-800 transition-colors duration-200 px-4 py-2 bg-blue-50">
                  {guide.title}

                </AccordionTrigger>

                <AccordionContent className="bg-white">

                  <ol className="list-decimal list-inside pl-4 py-2 space-y-1">
                    {guide.steps.map((step, stepIndex) => (

                      <li key={stepIndex} className="text-sm text-blue-600">
                        {step}

                      </li>
                    ))}

                  </ol>
                </AccordionContent>

              </AccordionItem>
            ))}

          </Accordion>
        </CardContent>

      </Card>
    </div>

  );

}

