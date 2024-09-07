package main

import (
	"encoding/json"
	"net/http"

	"github.com/shirou/gopsutil/cpu"
	"github.com/shirou/gopsutil/mem"
)

type Stats struct {
	CPUUsage    []float64 `json:"cpu_usage"`
	MemoryUsed  uint64    `json:"memory_used"`
	MemoryTotal uint64    `json:"memory_total"`
}

func getMemoryUsage() (uint64, uint64) {
	v, err := mem.VirtualMemory()
	if err != nil {
		return 0, 0
	}
	return v.Used, v.Total
}

func getStats(w http.ResponseWriter, r *http.Request) {
	// Fetch CPU usage per core
	cpuPercentages, err := cpu.Percent(0, true)
	if err != nil {
		http.Error(w, "Could not retrieve CPU usage", http.StatusInternalServerError)
		return
	}

	// Fetch Memory usage
	memoryUsed, memoryTotal := getMemoryUsage()

	stats := Stats{
		CPUUsage:    cpuPercentages,
		MemoryUsed:  memoryUsed,
		MemoryTotal: memoryTotal,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stats)
}

func main() {
	http.HandleFunc("/stats", getStats)
	http.Handle("/", http.FileServer(http.Dir("./frontend/build")))
	http.ListenAndServe(":8080", nil)
}
