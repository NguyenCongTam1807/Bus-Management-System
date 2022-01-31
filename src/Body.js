import React from 'react'
import HeaderPoster from './HeaderPoster';
import SearchBox from './SearchBox';
import BodyAdv from './BodyAdv';
import ListTrip from './ListTrip';
export default function Body() {
    return (
        <div>
            <HeaderPoster/>
            <SearchBox/>
            <BodyAdv/>
            <ListTrip/>
        </div>
    )
}
