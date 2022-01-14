package main

import (
	"fmt"
	"os"

	"github.com/ZdravkoGyurov/grader/pkg/app"
	"github.com/ZdravkoGyurov/grader/pkg/config"
)

func main() {
	config, err := config.Load()
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	app := app.New(config)
	if err := app.Start(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
