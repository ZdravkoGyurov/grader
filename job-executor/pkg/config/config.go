package config

import (
	"os"
	"path"
	"time"

	"github.com/ZdravkoGyurov/grader/job-executor/pkg/log"

	"gopkg.in/yaml.v2"
)

const (
	configFileName = "config.yaml"
	secretFileName = "secret.yaml"
)

var configDir = os.Getenv("CONFIG_DIR")

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

	configFile, err := os.ReadFile(path.Join(configDir, configFileName))
	if err != nil {
		return cfg, err
	}
	secretFile, err := os.ReadFile(path.Join(configDir, secretFileName))
	if err != nil {
		return cfg, err
	}

	err = yaml.Unmarshal(configFile, &cfg)
	if err != nil {
		return cfg, err
	}
	err = yaml.Unmarshal(secretFile, &cfg)
	if err != nil {
		return cfg, err
	}

	log.DefaultLogger().Info().Msgf("loaded config: %+v", cfg)
	return cfg, nil
}
