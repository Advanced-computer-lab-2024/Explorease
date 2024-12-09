import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function StepByStepTourist() {

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

      title: "How to file complaints",

      steps: [

        "press on the sidebar",
        "select complaints",
        "fill all the fields",
        "press submit complaint",
      ]

    },

    {

      title: "How to view bookings",

      steps: [

        "press on the sidebar",
        "select view bookings",
      ]

    },

    {

      title: "How to view review your guides",

      steps: [

        "press on the sidebar",
        "select review your guides  ",
      ]

    },

    {

      title: "How to purchase products",

      steps: [

        "press on the sidebar",
        "select purchased products",
      ]

    },

    {

      title: "How to select points",

      steps: [

        "press on the sidebar",
        "select my points",
      ]

    },

    {

      title: "How to saved events",

      steps: [

        "press on the sidebar",
        "select saved events",
      ]

    },

    {

      title: "How to search and filter in activities",

      steps: [

        "press on the navbar",
        "select activities",
        "filter with name",
        "press search and filter"
      ]

    },

    {

      title: "How to make your transportation",

      steps: [

        "press on the navbar",
        "select transportation ",
        "select origin on  maps ",
        "press set origin",
        "select destination on  maps ",
        "press set destination",
        "press get route"
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

            Tourist 
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


