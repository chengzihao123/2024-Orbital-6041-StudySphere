import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

export default function ColorTabs() {
  const [value, setValue] = React.useState("one");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="secondary tabs example"
        sx={{
          "& .MuiTabs-flexContainer": {
            justifyContent: "space-between",
          },
          "& .MuiTab-root": {
            minWidth: "300px",
            fontWeight: "bold",
            fontSize: "20px",
            textTransform: "none", // Prevents all-caps
          },
          "& .Mui-selected": {
            color: "primary.main", // Custom color for selected tab
          },
          "& .MuiTabs-indicator": {
            height: 3, // Custom indicator thickness
          },
        }}
      >
        <Tab value="one" label="Todo List" />
        <Tab value="two" label="Community" />
      </Tabs>
    </Box>
  );
}
