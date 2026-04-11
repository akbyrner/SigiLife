import { SearchBox } from '@mapbox/search-js-react';

export default function MapSearchBox({ onRetrieve, accessToken }: { onRetrieve: (res: any) => void, accessToken: string }) {
  return (
    <div className="w-full px-4 mb-4" style={{ minHeight: '50px', width: "250px"}}>
      <SearchBox
        accessToken={accessToken}
        onRetrieve={(res) => {
          console.log("Search result:", res);
          onRetrieve(res);
        }}
        placeholder="Search for a location..."
        theme={{
            variables: {
                fontFamily: '"New Rocker", system-ui',
                unit: '14px',
                borderRadius: '12px',
                colorPrimary: '#9e38fd',
                colorBackground: 'rgba(255, 255, 255, 0.95)', // Nearly white for max visibility
                colorText: '#000000'
            }
        }}
      />
    </div>
  )
};