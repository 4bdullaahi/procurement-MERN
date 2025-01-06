import React from 'react'
import CIcon from '@coreui/icons-react'
import {
    cilBell,
    cilCalculator,
    cilChartPie,
    cilCursor,
    cilDescription,
    cilDrop,
    cilNotes,
    cilPencil,
    cilPuzzle,
    cilSpeedometer,
    cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [{
        component: CNavItem,
        name: 'Dashboard',
        to: '/dashboard',
        icon: < CIcon icon = { cilSpeedometer }
        customClassName = "nav-icon" / > ,
        badge: {
            color: 'info',
            text: 'NEW',
        },
    },
    {
        component: CNavTitle,
        name: 'Theme',
    },



    {
        component: CNavGroup,
        name: 'Registration',
        to: '/base',
        icon: < CIcon icon = { cilPuzzle }
        customClassName = "nav-icon" / > ,
        items: [
            {
              component: CNavItem,
              name: 'Customer',
              to: '/registration/customerRegistration',
            }, 

        ],
    },
    
    {
        component: CNavGroup,
        name: 'Purchase',
        to: '/base',
        icon: < CIcon icon = { cilPuzzle }
        customClassName = "nav-icon" / > ,
        items: [
            {
                component: CNavItem,
                name: 'Order',
                to: '/registration/purchaseRecieve',
            },

            
          
           
            
        ],
    },
    {
        component: CNavGroup,
        name: 'Items',
        to: '/base',
        icon: < CIcon icon = { cilPuzzle }
        customClassName = "nav-icon" / > ,
        items: [{
                component: CNavItem,
                name: 'Item',
                to: '/registration/itemRegistration',
            },
          
           
            
        ],
    },

    {
        component: CNavGroup,
        name: 'Category',
        to: '/base',
        icon: < CIcon icon = { cilPuzzle }
        customClassName = "nav-icon" / > ,
        items: [{
                component: CNavItem,
                name: 'Category',
                to: '/registration/categoryReistration',
            },
          
           
            
        ],
    },
    {
        component: CNavGroup,
        name: 'Vendor',
        to: '/base',
        icon: < CIcon icon = { cilPuzzle }
        customClassName = "nav-icon" / > ,
        items: [{
                component: CNavItem,
                name: 'Vendor',
                to: '/registration/vendorRegistration',
            },
          
           
            
        ],
    },
]

export default _nav