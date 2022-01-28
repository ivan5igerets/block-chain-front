import axios from "axios";
import magnifyingGlass from '../magnifying-glass.svg';
import {useState, useEffect} from "react";

function TransactionsBlock() {

  const pageLimit = 5

  const [transactions, setTransactions] = useState([])
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFieldValue, setSearchFieldValue] = useState('');
  const [searchParamName, setSearchParamName] = useState('hash');
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    fetchTransactions(searchParamName, searchFieldValue)
  }, [])

  const fetchTransactions = async (paramName, searchValue) => {
    try {
      setIsLoading(true)
      const result = await axios.get('https://agile-plains-30000.herokuapp.com/get_transactions', {
        params: {
          filter_name: paramName,
          filter_value: searchValue,
          page: currentPage,
          limit: 10
        }
      })

      console.log(result, '_result')

      if (result.data.errors) {
        console.log('Error')
        setTransactions([])
        setPages(1)
      } else {
        setTransactions(result.data.transactions)
        setPages(Math.ceil(result.data.request_count / 10))
      }

      setIsLoading(false)
    } catch (e) {
      console.error(e)
      setPages(1)
      setIsLoading(false)
    }
  }

  const submitHandler = async (event) => {
    event.preventDefault()
    setCurrentPage(1)
    await fetchTransactions(searchParamName, searchFieldValue)
  }

  const searchInputHandler = (event) => {
    setSearchFieldValue(event.target.value)
  }

  const onChangeHandler = (event) => {
    setSearchParamName(event.target.value)
  }

  const TableRows = () => {
    if (transactions.length == 0) {
      return null
    }

    return transactions.map( (transaction, index) => {
        return (<tr key={transaction._id}>
          <td className='text-overflow-ellipsis'>{transaction.block_number}</td>
          <td className='text-overflow-ellipsis'>{transaction.hash}</td>
          <td className='text-overflow-ellipsis'>{transaction.sender}</td>
          <td className='text-overflow-ellipsis'>{transaction.recipient}</td>
          <td className='text-overflow-ellipsis'>{transaction.confirmations}</td>
          <td className='text-overflow-ellipsis'>Date</td>
          <td className='text-overflow-ellipsis'>{transaction.value}</td>
          <td className='text-overflow-ellipsis'>{transaction.fee}</td>
        </tr>)
      })
  }

  const MobileTable = () => {
    return transactions.length == 0 ?
      <div className='nothing-to-found'>Nothing found</div> :
      transactions.map( (transaction, index) => {
      return (
        <div className='mobile-record-item' key={transaction._id}>
          <div className='text-overflow-ellipsis'>
            <div className='text-title'>Block number</div>
            <div className='text-content text-overflow-ellipsis'>{transaction.block_number}</div>
          </div>

          <div className='text-overflow-ellipsis'>
            <div className='text-title'>Transaction ID</div>
            <div className='text-content text-overflow-ellipsis'>{transaction.hash}</div>
          </div>

          <div className='text-overflow-ellipsis'>
            <div className='text-title'>Sender</div>
            <div className='text-content text-overflow-ellipsis'>{transaction.sender}</div>
          </div>

          <div className='text-overflow-ellipsis'>
            <div className='text-title'>Recipient</div>
            <div className='text-content text-overflow-ellipsis'>{transaction.recipient}</div>
          </div>

          <div className='text-overflow-ellipsis'>
            <div className='text-title'>Block confirmations</div>
            <div className='text-content text-overflow-ellipsis'>{transaction.confirmations}</div>
          </div>

          <div className='text-overflow-ellipsis'>
            <div className='text-title'>Date</div>
            <div className='text-content text-overflow-ellipsis'>-</div>
          </div>

          <div className='text-overflow-ellipsis'>
            <div className='text-title'>Value</div>
            <div className='text-content text-overflow-ellipsis'>{transaction.value}</div>
          </div>

          <div className='text-overflow-ellipsis'>
            <div className='text-title'>Transaction Fee</div>
            <div className='text-content text-overflow-ellipsis'>{transaction.fee}</div>
          </div>
        </div>
      )
    })
  }

  async function goToNextPage() {
    setCurrentPage((page) => page + 1);
    await fetchTransactions(searchParamName, searchFieldValue)
  }

  async function goToPreviousPage() {
    setCurrentPage((page) => page - 1);
    await fetchTransactions(searchParamName, searchFieldValue)
  }

  async function changePage(event) {
    const pageNumber = Number(event.target.textContent);
    setCurrentPage(pageNumber);
    await fetchTransactions(searchParamName, searchFieldValue)
  }

  const getPaginationGroup = () => {
    let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
    let paginationGroup = new Array(pageLimit).fill().map((_, idx) => start + idx + 1)
    paginationGroup = paginationGroup.filter(item => {
      return item <= pages
    })
    return paginationGroup
  };

  return (
    <div className='container'>
      <div className='filters'>
        <form className='d-flex' onSubmit={submitHandler}>
          <div className='filter-field d-flex align-items-center'>

            <input className='search-input' placeholder='Search' onInput={searchInputHandler} />

            <div className='vertical-divider'></div>

            <select className='search-select' onChange={onChangeHandler} >
              <option value='hash'>Transaction ID</option>
              <option value='recipient'>Recipient</option>
              <option value='sender'>Sender</option>
              <option value='block_number'>Block number</option>
            </select>

          </div>
          <button type='submit' className='search-button'>
            <img src={magnifyingGlass} />
          </button>
        </form>
      </div>

      {isLoading ?
        <div className='loader-container d-flex justify-content-center'>
          <div className="lds-spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        :
        <>
          <div className='mt-15px'>
            <table className='table'>
              <thead>
                <tr>
                  <th>Block number</th>
                  <th>Transaction ID</th>
                  <th>Sender address</th>
                  <th>Recipient's address</th>
                  <th>Block confirmations</th>
                  <th>Date</th>
                  <th>Value</th>
                  <th>Transaction Fee</th>
                </tr>
              </thead>
              <tbody>
                <TableRows />
              </tbody>
            </table>
          </div>

          <MobileTable />
        </>
      }

      <div className='pagination'>
        {pages > 1 &&
          <div className='d-flex'>
            <div className='pagination-arrow d-flex justify-content-center align-items-center'>
              {currentPage != 1 ?
                <svg onClick={goToPreviousPage} className='cursor-pointer' width="17" height="28" viewBox="0 0 17 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 2L3 14L15 26" stroke="#3A80BA" strokeWidth="4" strokeLinecap="round"/>
                </svg> :
                <svg width="17" height="28" viewBox="0 0 17 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 2L3 14L15 26" stroke="#F1F1F1" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              }
            </div>

            {getPaginationGroup().map((item, index) => (
              <button
                key={index}
                onClick={changePage}
                className={`pagination-item cursor-pointer ${currentPage === item ? 'active-page' : null}`}
              >
                <span>{item}</span>
              </button>
            ))}

            <div className='pagination-arrow d-flex justify-content-center align-items-center'>
              {currentPage != pages ?
                <svg onClick={goToNextPage}  className='cursor-pointer' width="17" height="28" viewBox="0 0 17 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 2L14 14L2 26" stroke="#3A80BA" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              :
                <svg width="17" height="28" viewBox="0 0 17 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 2L14 14L2 26" stroke="#F1F1F1" strokeWidth="4" strokeLinecap="round"/>
                </svg>}
            </div>
          </div>}
      </div>

    </div>
  )
}

export default TransactionsBlock