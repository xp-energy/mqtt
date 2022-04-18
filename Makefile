include .env

mkfile_path := $(abspath $(lastword $(MAKEFILE_LIST)))
mkfile_dir := $(dir $(mkfile_path))

release:
		${mkfile_dir}/node_modules/.bin/cross-env GITHUB_TOKEN=${GITHUB_TOKEN} yarn release
