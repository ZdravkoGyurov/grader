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
	Gitlab   `yaml:"gitlab"`
}

type Server struct {
	ReadTimeout     time.Duration `yaml:"read_timeout"`
	WriteTimeout    time.Duration `yaml:"write_timeout"`
	ShutdownTimeout time.Duration `yaml:"shutdown_timeout"`
}

type DB struct {
	URI            string        `yaml:"uri"`
	ConnectTimeout time.Duration `yaml:"connect_timeout"`
	RequestTimeout time.Duration `yaml:"request_timeout"`
}

type Executor struct {
	MaxWorkers        int `yaml:"max_workers"`
	MaxConcurrentJobs int `yaml:"max_concurrent_jobs"`
}

type Gitlab struct {
	Host            string `yaml:"host"`
	GroupParentName string `yaml:"group_parent_name"`
	User            string `yaml:"user"`
	UserEmail       string `yaml:"user_email"`
	PAT             string `yaml:"pat"`
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
