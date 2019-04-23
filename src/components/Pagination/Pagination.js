import React from 'react'
import {Pagination} from 'react-materialize';

function PaginationComponent({onSelect, pagination}) {
	
	return (
		<div className="center">
			<Pagination
				items={pagination.allPage || 1}
				activePage={pagination.activePage || 1}
				maxButtons={5}
				onSelect={onSelect}
			/>
		</div>
	)
}

export default PaginationComponent