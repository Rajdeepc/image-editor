import React, { useCallback, useMemo, useState } from "react"
import Card from "../components/Card"
import data from "../utils/constants"
import styles from "../styles/Home.module.css"
import LottieControl from "../components/LottieControl/LottieControl"
import Nav from '../components/Nav/Nav';


export default function Home() {
  const [selectedFilterId, setSelectedFilterId] = useState<string>("")
  const [loading, setLoading] = useState<Boolean>(false)
  const [filterData, setFilterData] = useState<Array>([])

  // Function to add our give data into cache
  const addDataIntoCache = (
    cacheName = "MyCache",
    url = window.location.href,
    response = "SampleData"
  ) => {
    // Converting our response into Actual Response form
    const data = new Response(JSON.stringify(response))

    if ("caches" in window) {
      // Opening given cache and putting our data into it
      caches.open(cacheName).then((cache) => {
        cache.put(url, data)
        alert("Data Added into cache!")
      })
    }
  }

  // Function to get all cache data
  const getAllCacheData = async () => {
    var url = "https://localhost:300"

    // List of all caches present in browser
    var names = await caches.keys()

    var cacheDataArray: any[] = []

    // Iterating over the list of caches
    names.forEach(async (name) => {
      // Opening that particular cache
      const cacheStorage = await caches.open(name)

      // Fetching that particular cache data
      const cachedResponse = await cacheStorage.match(url)
      var data = await cachedResponse.json()

      // Pushing fetched data into our cacheDataArray
      cacheDataArray.push(data)
    })
  }

  const getSingleCacheData = async (cacheName: any, url: any) => {
    const cacheStorage = await caches.open(cacheName)
    const cachedResponse = await cacheStorage.match(url)
    if (!cachedResponse || !cachedResponse.ok) {
      return false
    }

    return await cachedResponse.json()
  }

  const getData = async () => {
    const cachedData = await getSingleCacheData("MyCache", window.location.href)
    if (cachedData && cachedData.length) {
      console.log("retrieving from cache")
      return cachedData
    } else {
      console.log("adding to cache")
      fetch("data.json")
        .then((response) => {
          if (!response.ok) {
            throw new Error("HTTP error " + response.status)
          }
          return response.json()
        })
        .then((myJson) => {
          addDataIntoCache("MyCache", window.location.href, myJson)
          return myJson
        })
    }
  }

  const handleCardClick = useCallback(async (id: string) => {
    setLoading(true)
    try {
      const data = await getData()
      if (data) {
        setTimeout(() => {
          setLoading(false)
          setSelectedFilterId(id)
          setFilterData(data)
        }, 200)
      }
    } catch (e) {
      setLoading(false)
    }
  }, [])

  const getImageStyle = (filterName: String) => {
    const selectedItem = filterData.find(
      (item: { id: String }) => item.id === filterName
    )
    if (selectedFilterId) {
      const filters = selectedItem?.value?.map(
        (option: { property: any; value: any; unit: any }) => {
          return `${option.property}(${option.value}${option.unit})`
        }
      )
      return {
        filter: filters?.join(" "),
      }
    }
  }

  return (
    <div className={styles.App}>
      <Nav/>
      <div className={styles.wrapper}>
      <div className={styles.leftGrid}>
        <div className={styles.filterList}>
          {(data || []).map((item) => (
            <Card
              key={item.id}
              item={item}
              active={selectedFilterId === item.id}
              onCardClick={handleCardClick}
            />
          ))}
        </div>
      </div>
      <div className={styles.rightGrid}>
        <div className={styles.canvas}>
          {loading ? <LottieControl width={100} height={100}/> :
          selectedFilterId && (
            <img
              src="https://cdn.pixabay.com/photo/2022/10/28/11/14/leaves-7552915_1280.png"
              alt="upload"
              style={getImageStyle(selectedFilterId)}
            />
          )}
        </div>
      </div>
      </div>
      
    </div>
  )
}
