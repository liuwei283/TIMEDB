class Dataset < ApplicationRecord
  belongs_to :user, touch: true
  has_and_belongs_to_many :samples
  # validates :name, presence: true, uniqueness: { 
  #   message: ->(object, data) do
  #     "Dataset #{data[:value]} already exists. "
  #   end
  # }, on: :create

  def inf_file()
    ids = sample_ids
    return Sample.selected_inf_to_tsv(ids)
  end

  def metadata_file()
    ids = sample_ids
    return Sample.selected_to_csv(ids)
  end

  def add_samples(ids)
    if ids
      @samples = Sample.find(ids)
      @samples.each do |sample|
        unless samples.exists?(sample.id)
          samples << sample
        end
      end
    end
  end

  def delete_samples(ids)
    @samples = Sample.find(ids)
    samples.delete(@samples)
  end

  def mergeFile()
    #get all projects with samples
    projects = getProjectSources()
    @merged_files = {}
    @merged_files["Clinical data"] = []
    @merged_files["Gene expression data"] = []
    projects.each_key do |pname|
      sample_clinical_file_path = "#{Rails.root}/public/data/clinical/sample/Clinical_#{pname}.csv"
      sample_rna_file_path = "#{Rails.root}/public/data/RNA/RNA_#{pname}.csv"
      snames = projects[pname]

      #merge clinical files
      file_info = CSV.parse(File.read(sample_clinical_file_path), headers: TRUE)
      cur_headers = file_info.headers
      file_for_selected_samples = CSV.generate(write_headers: true, headers: cur_headers) do |csv|
        file_info.each do |row|
          if snames.include? row['sample_name']
            csv << row
          end
        end
      end
      @merged_files["Clinical data"].push(file_for_selected_samples)

      #merge gene expression files
      file_info = CSV.parse(File.read(sample_rna_file_path), headers: TRUE)

      remained_col = sname.push["GeneSymbol"]
      
      filtered_rna_info = file_info.by_col!.delete_if do |column_name,column_values|
        !remained_col.include? column_name
      end
      
      filtered_rna_file = filtered_rna_info.to_csv
      @merged_files["Gene expression data"].push(filtered_rna_file)
    end
    return @merged_files
  end


  def getProjectSources()
    projects = {}
    samples = @dataset.samples.order(:sample_name)
    samples.each do |sample|
        sname = sample.sample_name
        pname = sample.project_name
        logger.error sname
        if projects.key?(pname)
            projects[pname].push(sname)
        else
            projects[pname] = [sname]
        end
    end
    return projects
  end


end
