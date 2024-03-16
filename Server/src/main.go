package main

import (
    "context"
    "encoding/json"
    "log"
    "net/http"

    "github.com/gorilla/mux"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

// Shape struct to represent a drawn shape
type Shape struct {
    Geometry Geometry `json:"geometry"`
}

// Geometry struct to represent the geometry of the shape
type Geometry struct {
    Type        string      `json:"type"`
    Coordinates [][]float64 `json:"coordinates"`
}

func main() {
    // Connect to MongoDB
    clientOptions := options.Client().ApplyURI("mongodb+srv://shyamgopalbiswas:Sgbiswas22114atlas@cluster0.in6i802.mongodb.net/GeoData?retryWrites=true&w=majority")
    client, err := mongo.Connect(context.Background(), clientOptions)
    if err != nil {
        log.Fatal(err)
    }
    defer client.Disconnect(context.Background())

    // Initialize router
    router := mux.NewRouter()

    // Define endpoint to save shape to MongoDB
    router.HandleFunc("/save-shape", func(w http.ResponseWriter, r *http.Request) {
        var shape Shape
        err := json.NewDecoder(r.Body).Decode(&shape)
        if err != nil {
            http.Error(w, err.Error(), http.StatusBadRequest)
            return
        }

        // Insert shape into MongoDB collection
        shapesCollection := client.Database("GeoData").Collection("Coordinates")
        _, err = shapesCollection.InsertOne(context.Background(), shape)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        w.WriteHeader(http.StatusCreated)
        json.NewEncoder(w).Encode(map[string]string{"message": "Shape saved successfully"})
    }).Methods("POST")

    // Start server
    log.Println("Server started on port 8000")
    log.Fatal(http.ListenAndServe(":8000", router))
}
