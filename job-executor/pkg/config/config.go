package config

import (
	"os"
	"path"
	"time"

	"gopkg.in/yaml.v2"
)

const (
	configDir         = "config"
	appConfigFileName = "app_config.yaml"
)

// Config for application properties
type Config struct {
	Host     string `yaml:"host"`
	Port     int    `yaml:"port"`
	Server   `yaml:"server"`
	DB       `yaml:"db"`
	Executor `yaml:"executor"`
}

type Server struct {
	ReadTimeout     time.Duration `yaml:"readTimeout"`
	WriteTimeout    time.Duration `yaml:"writeTimeout"`
	ShutdownTimeout time.Duration `yaml:"shutdownTimeout"`
}

type DB struct {
	URI            string        `yaml:"uri"`
	ConnectTimeout time.Duration `yaml:"connectTimeout"`
	RequestTimeout time.Duration `yaml:"requestTimeout"`
}

type Executor struct {
	MaxWorkers        int `yaml:"maxWorkers"`
	MaxConcurrentJobs int `yaml:"maxConcurrentJobs"`
}

func Load() (Config, error) {
	cfg := Config{}

	appConfigFile, err := os.ReadFile(path.Join(configDir, appConfigFileName))
	if err != nil {
		return cfg, err
	}

	err = yaml.Unmarshal(appConfigFile, &cfg)
	if err != nil {
		return cfg, err
	}

	return cfg, nil
}
