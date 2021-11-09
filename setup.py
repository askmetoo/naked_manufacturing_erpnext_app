from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in naked_manufacturing/__init__.py
from naked_manufacturing import __version__ as version

setup(
	name="naked_manufacturing",
	version=version,
	description="naked_manufacturing",
	author="admin@gmail.com",
	author_email="admin@gmail.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
