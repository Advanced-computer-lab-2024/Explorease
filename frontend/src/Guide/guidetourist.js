import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Card, CardContent, CardHeader, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
        "select origin on maps ",
        "press set origin",
        "select destination on maps ",
        "press set destination",
        "press get route"
      ]
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Step-by-Step Guides
      </Typography>

      <Card sx={{ boxShadow: 3 }}>
        <CardHeader title="Tourist" subheader="Step-by-step guides" sx={{ backgroundColor: '#e3f2fd' }} />
        <CardContent>

          <Accordion disableGutters={true} sx={{ marginBottom: 2 }}>
            {guides.map((guide, index) => (
              <Accordion key={index} sx={{ marginBottom: 2 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index}bh-content`}
                  id={`panel${index}bh-header`}
                >
                  <Typography variant="h6" color="primary">{guide.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ol>
                    {guide.steps.map((step, stepIndex) => (
                      <li key={stepIndex}>
                        <Typography variant="body2" color="textSecondary">{step}</Typography>
                      </li>
                    ))}
                  </ol>
                </AccordionDetails>
              </Accordion>
            ))}
          </Accordion>

        </CardContent>
      </Card>
    </div>
  );
}
